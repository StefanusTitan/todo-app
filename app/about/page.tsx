export default function About() {
    return (
      <div
        style={{
          margin: '2rem auto',
          maxWidth: '600px',
          padding: '1.5rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <b><h1 style={{ textAlign: 'center', color: '#333' }}>About the Application</h1></b>
        <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1rem' }}>
          Welcome to my prototype To-Do list application, to exercise, learn, and implement React, Next.js, Express, and Sequelize!
        </p>
        <ul style={{ paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
          <li>📋 Create and manage your daily tasks with ease.</li>
          <li>✅ Mark tasks as complete to track your progress.</li>
          <li>🗓️ Set priorities and deadlines for better task management.</li>
        </ul>
      </div>
    );
  }