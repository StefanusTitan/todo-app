"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from "next/navigation";
require('dotenv').config();

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
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

  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userTodo`, {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });
  
        if (response.status === 401) {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            <option value="in-progress">In Progress</option>
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
            </tr>
          </thead>
          <tbody>
          {todos.map((todo) => (
            <tr key={`${todo.id}-${todo.title}`}>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.status}</td>
              <td>{todo.priority}</td>
              <td>{todo.due_date}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        #container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
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
        }
      `}</style>
    </div>
  );
}