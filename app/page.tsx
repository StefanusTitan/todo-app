"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";
require('dotenv').config();

interface Todo {
  item_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  completed_at?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]); // State to hold the list of to-dos
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
    due_date: '',
  });
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); // Track which to-do is being edited
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userTodo`, {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (response.status === 401 || response.status === 403) {
          // Redirect to the login page if unauthorized
          router.push("/login");
          return; // Stop further execution
        }

        if (!response.ok) {
          throw new Error("Failed to fetch to-dos");
        }

        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching to-dos:", error);
      }
    };

    fetchUserTodos();
  }, [router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    id?: number
  ) => {
    const { name, value } = e.target;

    if (editingTodoId !== null && id === editingTodoId) {
      // Update the specific to-do being edited
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.item_id === id ? { ...todo, [name]: value } : todo
        )
      );
    } else {
      // This is for form input handling (title, description, etc.)
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to-do');
      }

      const newTodo: Todo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]); // Add the new to-do to the list
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'low',
        due_date: '',
      });
    } catch (error) {
      console.error('Error adding to-do:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to delete to-do');
      }

      // Remove the deleted to-do from the list
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.item_id !== id));
    } catch (error) {
      console.error('Error deleting to-do:', error);
    }
  };

  const handleEdit = (id: number) => {
    if (editingTodoId === id) {
      setEditingTodoId(null); // Close the editing mode if clicking the same to-do again
    } else {
      setEditingTodoId(id); // Set to the ID of the to-do you want to edit
    }
  };

  const handleSave = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.item_id === id);
      if (!todoToUpdate) return;

      // Update completed_at if status is 'completed'
      if (todoToUpdate.status === 'completed') {
        todoToUpdate.completed_at = new Date().toISOString();
      } else {
        todoToUpdate.completed_at = undefined;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(todoToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update to-do');
      }

      // Update the local state with the edited to-do
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.item_id === id ? { ...todoToUpdate } : todo))
      );

      setEditingTodoId(null); // Exit editing mode
    } catch (error) {
      console.error('Error saving to-do:', error);
    }
  };

  return (
    <div id="container">
      <h1>Create your To-Do list!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter the title"
            required
            value={formData.title}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter the description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            aria-label="Description"
          ></textarea>
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-label="Status"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-label="Priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="due_date">Due Date:</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            aria-label="Due Date"
          />
        </div>
        <button type="submit">Add To-Do</button>
      </form>

      <h2>Your To-Do List</h2>
      <div id="todo-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Completed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={`${todo.item_id}-${todo.title}`}>
                <td>
                  {editingTodoId === todo.item_id ? (
                    <input
                      type="text"
                      name="title"
                      value={todo.title}
                      onChange={(e) => handleChange(e, todo.item_id)}
                    />
                  ) : (
                    todo.title
                  )}
                </td>
                <td>
                  {editingTodoId === todo.item_id ? (
                    <textarea
                      name="description"
                      value={todo.description}
                      onChange={(e) => handleChange(e, todo.item_id)}
                    />
                  ) : (
                    todo.description
                  )}
                </td>
                <td>
                  {editingTodoId === todo.item_id ? (
                    <select
                      name="status"
                      value={todo.status}
                      onChange={(e) => handleChange(e, todo.item_id)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    todo.status
                  )}
                </td>
                <td>
                  {editingTodoId === todo.item_id ? (
                    <select
                      name="priority"
                      value={todo.priority}
                      onChange={(e) => handleChange(e, todo.item_id)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    todo.priority
                  )}
                </td>
                <td>
                  {editingTodoId === todo.item_id ? (
                    <input
                      type="date"
                      name="due_date"
                      value={todo.due_date}
                      onChange={(e) => handleChange(e, todo.item_id)}
                    />
                  ) : (
                    todo.due_date
                  )}
                </td>
                <td>
                  {todo.completed_at}
                </td>
                <td className='buttons'>
                  {editingTodoId === todo.item_id ? (
                    <button onClick={() => handleSave(todo.item_id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(todo.item_id)}>Edit</button>
                  )}
                  <button onClick={() => handleDelete(todo.item_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        form {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
          text-align: center;
        }
        button {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 5px 10px;
          width: 100%;
          margin-top: 10px;
          cursor: pointer;
        }
        button:hover {
          background-color: #ff1a1a;
        }
        .buttons {
          display: flex;
          flex-direction:column;
          gap: 5px;
        }
        #todo-list {
          background-color: white;
        }
      `}</style>
    </div>
  );
}