const TodoItem = require('../models/TodoItem.js');

// Create a To-Do item
async function createTodo(title, description, status, priority, due_date, user_id) {
    try {
        const todo = await TodoItem.create({ title, description, status, priority, due_date, user_id });
        console.log('To-do created:', todo.toJSON());
        return todo;
    } catch (error) {
        console.error('Error creating To-do:', error);
    }
}

// Get all To-Do items
async function getTodos() {
    try {
        const todos = await TodoItem.findAll();
        console.log('All todos:', todos);
        return todos;
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Get a specific To-Do item by ID
async function getTodosByUserId(user_id) {
    try {
        const todos = await TodoItem.findAll({
            where: {
                user_id: user_id
            }
        });

        if (todos.length === 0) {
            console.log(`No To-dos found for user with ID ${user_id}`);
            return null;
        }
        
        console.log('To-dos found:', todos.map(todo => todo.toJSON()));
        return todos;
    } catch (error) {
        console.error('Error fetching To-dos:', error);
    }
}

// Update a To-Do item
async function updateTodo(item_id, updatedFields) {
    try {
        const todo = await TodoItem.findByPk(item_id);
        if (!todo) {
            console.log(`To-do with ID ${item_id} not found`);
            return null;
        }
        await todo.update(updatedFields);
        console.log('To-do updated:', todo.toJSON());
        return todo;
    } catch (error) {
        console.error('Error updating To-do:', error);
    }
}

// Delete a To-Do item
async function deleteTodo(item_id) {
    try {
        const todo = await TodoItem.findByPk(item_id);
        if (!todo) {
            console.log(`To-do with ID ${item_id} not found`);
            return null;
        }
        await todo.destroy();
        console.log(`To-do with ID ${item_id} deleted`);
        return true;
    } catch (error) {
        console.error('Error deleting To-do:', error);
    }
}

module.exports = { createTodo, getTodos, getTodosByUserId, updateTodo, deleteTodo };