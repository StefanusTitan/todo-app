const express = require('express');
const User = require('./models/Users.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const upload = require('./controllers/multer.js');
const { 
    createUser, 
    getUsers, 
    updateUser, 
    deleteUser,
    resetPassword
} = require('./controllers/userController');
const { 
    createTodo, 
    getTodos, 
    getTodosByUserId, 
    updateTodo, 
    deleteTodo 
} = require('./controllers/todoController');

const app = express();
const PORT = 3002;

const jwt = require('jsonwebtoken');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies and other credentials
}));

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and decode the user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error); // Log the error
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Routes for User Model
// Register route that accepts file uploads
app.post("/register", upload.single("profile_picture"), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePicturePath = req.file ? `/images/${req.file.filename}` : null;

  try {
    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profile_picture_path: profilePicturePath,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});
// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('Invalid credentials');
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in HTTP-only cookie
    res.cookie('token', token, { httpOnly: true });

    await user.update({ last_login: new Date() });

    // Send response with user and token
    return res.json({ 
      user: { id: user.id, username: user.username, email: user.email }, 
      token 
    });
} catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
}
});

// Logout Route
app.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Use the user ID from the decoded token
    if (!user) {
      return res.status(404).json({ error: 'User  not found' });
    }

    // Update user model, nullifying the current token and logging the last logout time
    await user.update({ last_logout: new Date() });

    // Optionally, clear the cookie
    res.clearCookie('token');

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout process:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

// Example of protecting a route
app.get('/profile', authenticateToken, async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id); // Fetch user from the database
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
  }
});

app.post('/users', async (req, res) => {
    const { username, email, password, profile_picture_path } = req.body;
    try {
        const user = await createUser(username, email, password, profile_picture_path);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.put('/users', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  updateUser(req, res);
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await deleteUser(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Routes for TodoItem Model
app.post('/todos', authenticateToken, async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  try {
      const todo = await createTodo(
          title, 
          description, 
          status, 
          priority, 
          due_date, 
          req.user.id // Pass user ID to associate todo with user
      );
      res.status(201).json(todo);
  } catch (error) {
      res.status(500).json({ error: 'Error creating To-do' });
  }
});

app.get('/todos', authenticateToken, async (req, res) => {
    try {
        const todos = await getTodos();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching To-dos' });
    }
});

app.get('/userTodo', authenticateToken, async (req, res) => {
    try {
        const todo = await getTodosByUserId(req.user.id);
        if (!todo) {
            return res.status(404).json({ error: 'To-do not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching To-do' });
    }
});

app.put('/todos/:id', authenticateToken, async (req, res) => {
    try {
        const updatedTodo = await updateTodo(req.params.id, req.body);
        if (!updatedTodo) {
            return res.status(404).json({ error: 'To-do not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error updating To-do' });
    }
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await deleteTodo(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'To-do not found' });
        }
        res.status(200).json({ message: 'To-do deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting To-do' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // For potential testing