
import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../api';
import AdminCourseStats from './AdminCourseStats';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) return;
    async function fetchDashboard() {
      setError('');
      try {
        let res;
        if (user.role === 'Learner') {
          res = await fetchAPI('/progress', 'GET');
        } else if (user.role === 'Creator') {
          res = await fetchAPI('/creator/courses', 'GET');
        } else if (user.role === 'Admin') {
          res = await fetchAPI('/admin/all-courses', 'GET');
        }
        setData(res.items || res.progress || []);
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard');
      }
    }
    fetchDashboard();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Dashboard</h2>
          <p className="text-gray-700">Please login to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{user.role} Dashboard</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="max-w-3xl mx-auto">
        {user.role === 'Learner' && (
          <>
            <h2 className="text-xl font-semibold mb-4">My Progress</h2>
            {(!data || data.length === 0) ? (
              <div className="text-gray-600 text-center">No enrollments yet.</div>
            ) : (
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-400 text-white">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Course</th>
                    <th className="py-3 px-4 font-semibold">Progress (%)</th>
                    <th className="py-3 px-4 font-semibold">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((enroll, idx) => (
                    <tr key={idx} className="hover:bg-purple-50 transition">
                      <td className="py-3 px-4 border-b border-gray-200">{enroll.course?.title}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{enroll.progress}</td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {enroll.certificateIssued ? (
                          <a
                            href={`/certificate/${enroll.course?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold hover:bg-green-200 transition"
                          >
                            View/Download Certificate
                          </a>
                        ) : (
                          <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">Not yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {user.role === 'Creator' && (
          <>
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            {(!data || data.length === 0) ? (
              <div className="text-gray-600 text-center">No courses yet.</div>
            ) : (
              <ul className="space-y-4">
                {[...data].reverse().map((course, idx) => (
                  <li key={idx} className="bg-white p-4 rounded shadow flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{course.title}</div>
                      <div className="text-gray-700">{course.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {user.role === 'Admin' && (
          <>
            <h2 className="text-xl font-semibold mb-4">All Courses & Stats</h2>
            {(!data || data.length === 0) ? (
              <div className="text-gray-600 text-center">No courses found.</div>
            ) : (
              <ul className="space-y-4">
                {data.map((course, idx) => (
                  <li key={idx} className="bg-white p-4 rounded shadow">
                    <div className="font-bold text-lg">{course.title}</div>
                    <div className="text-gray-700">{course.description}</div>
                    <div className="text-sm text-gray-500 mb-2">By: {course.creator?.name || 'Unknown'}</div>
                    <AdminCourseStats courseId={course._id} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
