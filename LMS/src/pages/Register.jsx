
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Learner' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetchAPI('/auth/register', 'POST', form);
      setForm({ name: '', email: '', password: '', role: 'Learner' });

      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {

      setError(err?.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
        <div className="hidden md:block md:w-1/2 pr-8">
          <img src="/registration.png" alt="Register" className="rounded-xl shadow-lg w-full h-64 object-cover" />
        </div>

        <form className="md:w-1/2 w-full" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-700 drop-shadow">Create Your Account</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="Learner">Learner</option>
            <option value="Creator">Creator</option>
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full shadow hover:scale-105 transition-transform font-semibold"
          >
            Register
          </button>
        </form>
      </div>
      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>
          Project by CH Venkata Narendra. View the source code on{' '}
          <a
            href="https://github.com/12narendra45/Micro_Courses"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
