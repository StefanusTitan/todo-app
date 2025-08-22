"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";
require('dotenv').config();

import { Todo, formatDate, getRowClass, formatStatus, formatPriority } from './utils/todoHelpers';

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

  const handleComplete = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.item_id === id);
      if (!todoToUpdate) return;

      // If already completed, do nothing
      if (todoToUpdate.status === 'completed') return;

      const updated = { ...todoToUpdate, status: 'completed', completed_at: new Date().toISOString() };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error('Failed to mark to-do completed');
      }

      // Update local state
      setTodos((prevTodos) => prevTodos.map((t) => (t.item_id === id ? updated : t)));
    } catch (error) {
      console.error('Error completing to-do:', error);
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

  // helpers are imported from ./utils/todoHelpers

  return (
    <div id="container">
      <h1>Create your To-Do list!</h1>
      <form onSubmit={handleSubmit} className="todo-form">
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
              <tr key={`${todo.item_id}-${todo.title}`} className={getRowClass(todo)}>
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
                    formatStatus(todo.status)
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
                    formatPriority(todo.priority)
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
                    formatDate(todo.due_date)
                  )}
                </td>
                <td>
                  {formatDate(todo.completed_at)}
                </td>
                <td className='buttons'>
                  {todo.status === 'completed' ? (
                    // For completed todos only allow deletion
                    <>
                      <button className="delete" onClick={() => handleDelete(todo.item_id)}>Delete</button>
                    </>
                  ) : (
                    // For non-completed todos show edit/save and complete + delete
                    <>
                      {editingTodoId === todo.item_id ? (
                        <button className="save" onClick={() => handleSave(todo.item_id)}>Save</button>
                      ) : (
                        <button className="edit" onClick={() => handleEdit(todo.item_id)}>Edit</button>
                      )}
                      <button className="complete" onClick={() => handleComplete(todo.item_id)}>Complete</button>
                      <button className="delete" onClick={() => handleDelete(todo.item_id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <style jsx>{`
        .todo-form {
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .todo-form {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            align-items: start;
          }
          /* make the Add button span both columns on larger screens */
          .todo-form button[type="submit"] {
            grid-column: 1 / -1;
          }
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto; /* center table in container */
        }
        th, td {
          border: 1px solid #ccc;
          padding: 10px 12px;
          text-align: center; /* center contents */
          vertical-align: middle;
        }
        th {
          background-color: #f4f4f4;
        }
        /* Action buttons inside the table (scoped) */
        .buttons button {
          color: white;
          border: none;
          padding: 6px 10px;
          width: 100%;
          margin-top: 8px;
          cursor: pointer;
          border-radius: 8px; /* rounded corners */
        }
        .buttons .edit { background-color: #1e90ff; }
        .buttons .edit:hover { background-color: #1a75d1; }
        .buttons .save { background-color: #4caf50; }
        .buttons .save:hover { background-color: #3e8e41; }
        .buttons .complete { background-color: #6a994e; }
        .buttons .complete:hover { background-color: #56823f; }
        .buttons .delete { background-color: #ff4d4d; }
        .buttons .delete:hover { background-color: #ff1a1a; }

        /* Dim completed rows for visual feedback (exclude action buttons cell) */
        tr.completed td:not(.buttons) {
          opacity: 0.7;
          text-decoration: line-through;
        }

        /* Keep action buttons readable in completed rows */
        tr.completed td.buttons,
        tr.completed td.buttons * {
          text-decoration: none !important; /* remove inherited line-through */
          opacity: 1 !important; /* keep buttons fully opaque for usability */
        }

        /* Overdue (past due) rows */
        tr.overdue td {
          background-color: #ffe6e6; /* light red */
        }

        /* Due within 24 hours */
        tr.due-soon td {
          background-color: #fff6e6; /* light yellow */
        }
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center; /* center action buttons horizontally */
        }
        #todo-list {
          background-color: white;
        }
      `}</style>
    </div>
  );
}