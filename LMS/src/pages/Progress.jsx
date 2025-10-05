
import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../api';

export default function Progress() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Progress</h2>
          <p className="text-gray-700">Please login to view your progress.</p>
        </div>
      </div>
    );
  }
  if (user.role !== 'Learner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Progress</h2>
          <p className="text-red-500">Access denied: Only learners can view progress.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function fetchProgress() {
      setError('');
      try {
  const res = await fetchAPI('/progress', 'GET', null);
        setProgress(res.progress);
      } catch (err) {
        setError(err?.error?.message || 'Failed to load progress');
      }
    }
    fetchProgress();
  }, [token]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Progress</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="max-w-3xl mx-auto">
        {progress.length === 0 ? (
          <div className="text-gray-600 text-center">No enrollments yet.</div>
        ) : (
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-400 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Course</th>
                <th className="py-3 px-4 font-semibold">Completed Lessons</th>
                <th className="py-3 px-4 font-semibold">Progress (%)</th>
                <th className="py-3 px-4 font-semibold">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {progress.map(enroll => (
                <tr key={enroll._id} className="hover:bg-purple-50 transition">
                  <td className="py-3 px-4 border-b border-gray-200">{enroll.course?.title}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{enroll.completedLessons?.length || 0}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{enroll.progress}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {enroll.certificateIssued ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Issued</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">Not yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
