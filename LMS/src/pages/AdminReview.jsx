
import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../api';
export default function AdminReview() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    setError('');
    try {
 
  const res = await fetchAPI('/admin/all-courses', 'GET');
  setCourses(res.items);
    } catch (err) {
      setError(err?.message || 'Failed to load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const handleApprove = async id => {
    setError('');
    setSuccess('');
    try {
      await fetchAPI(`/admin/review/courses/${id}/approve`, 'POST');
      setSuccess('Course approved!');
      fetchCourses();
    } catch (err) {
      setError(err?.message || 'Failed to approve course');
    }
  };

  return (
  <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Review Courses</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {success && <div className="text-green-500 mb-4 text-center">{success}</div>}

      <div className="max-w-3xl mx-auto">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2" />
            </svg>
            <div className="text-gray-600 text-center text-lg">No courses found.<br/>Check back later for new submissions.</div>
          </div>
        ) : (
          <ul className="space-y-4">
            {courses
              .slice() 
              .sort((a, b) => (a.reviewed === b.reviewed ? 0 : a.reviewed ? 1 : -1)) 
              .map(course => (
                <li key={course._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{course.title}</div>
                    <div className="text-gray-700">{course.description}</div>
                    <div className="text-sm text-gray-500">By: {course.creator?.name || 'Unknown'}</div>
                  </div>

                  {!course.reviewed ? (
                    <button
                      onClick={() => handleApprove(course._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded font-semibold">Approved</span>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
