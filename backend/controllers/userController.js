const User = require('../models/Users.js');
require('dotenv').config();
const bcrypt = require('bcryptjs');

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
async function updateUser(id, updatedFields) {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            console.log(`User with ID ${id} not found`);
            return null;
        }
        await user.update(updatedFields);
        console.log('User updated:', user.toJSON());
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

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