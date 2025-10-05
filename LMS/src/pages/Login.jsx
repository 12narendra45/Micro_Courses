
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await fetchAPI('/auth/login', 'POST', form);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      window.dispatchEvent(new Event('user-login'));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        if (res.user.role === 'Learner') {
          navigate('/courses');
        } else if (res.user.role === 'Admin') {
          navigate('/dashboard');
        } else {
          navigate('/creator/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err?.error?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
        <div className="hidden md:block md:w-1/2 pr-8">
          <img src="/login.png" alt="Login" className="rounded-xl shadow-lg w-full h-64 object-cover" />
        </div>

        <form className="md:w-1/2 w-full" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-700 drop-shadow">Login to Your Account</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-pink-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full shadow hover:scale-105 transition-transform font-semibold"
          >
            Login
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
