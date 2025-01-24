const User = require('../models/Users.js');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const upload = require("./multer.js"); // Import the multer middleware

// Get all users
async function getUsers() {
    try {
        const users = await User.findAll();
        console.log('All users:', users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Update a user
async function updateUser(req, res) {
    console.log(req.user.id);
    const { username, email, password } = req.body; // Other fields from the request body
    const profilePicture = req.file; // Uploaded file
    const updated_at = new Date().toISOString();

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: `User with ID ${req.user.id} not found` });
        }

        // Update fields
        const updatedFields = { username, email };
        if (password) {
            // Hash the password and create the user
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword; // Hash the password if needed
        }

        // Handle uploaded profile picture
        if (profilePicture) {
            const profilePicturePath = `/images/${profilePicture.filename}`;
            updatedFields.profile_picture_path = profilePicturePath;
        }
        updatedFields.updated_at = updated_at;

        await user.update(updatedFields);

        console.log("User updated:", user.toJSON());
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
}

// Delete a user
async function deleteUser(id) {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            console.log(`User with ID ${id} not found`);
            return null;
        }
        await user.destroy();
        console.log(`User with ID ${id} deleted`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Password reset function
async function resetPassword(email, newPassword) {
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        // If user not found
        if (!user) {
            console.log('User not found');
            return null;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await user.update({ password: hashedPassword });

        console.log('Password reset successful');
        return true;
    } catch (error) {
        console.error('Password reset error:', error);
        return null;
    }
}

// Modify createUser to hash password before saving
async function createUser(username, email, password, profile_picture_path) {
    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            profile_picture_path 
        });
        
        console.log('User created:', user.toJSON());
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

module.exports = { 
    createUser, 
    getUsers, 
    updateUser, 
    deleteUser, 
    resetPassword,
};