
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-8">
        <div className="md:w-1/2 w-full flex justify-center">
          <img src="/home.png" alt="MicroCourses Banner" className="rounded-xl shadow-lg w-full h-64 object-cover" />
        </div>
        <div className="md:w-1/2 w-full bg-white bg-opacity-90 p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-purple-700 drop-shadow">Welcome to MicroCourses</h1>
          <p className="text-gray-700 mb-8 text-lg">A modern LMS for learners, creators, and admins.<br/>Register or login to get started!</p>
          <div className="space-x-4">
            <a href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition-transform font-semibold">Register</a>
            <a href="/login" className="bg-white text-purple-700 border border-purple-400 px-6 py-3 rounded-full shadow hover:bg-purple-50 transition font-semibold">Login</a>
          </div>
        </div>
      </div>
      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>
          Project by [Your Name]. View the source code on{' '}
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
