
import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [nextOffset, setNextOffset] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  const fetchCourses = async (offset = 0) => {
    setLoading(true);
    setError('');
    try {
  const res = await fetchAPI(`/courses?limit=8&offset=${offset}`, 'GET', null);
      setCourses(offset === 0 ? res.items : [...courses, ...res.items]);
      setNextOffset(res.next_offset);
    } catch (err) {
      setError(err?.error?.message || 'Failed to load courses');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();

  }, []);


  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Published Courses</h1>
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by course title..."
          className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course._id} className="bg-white rounded shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <p className="text-sm text-gray-500">By: {course.creator?.name || 'Unknown'}</p>
            </div>
            <a
              href={`/courses/${course._id}`}
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
      
      {nextOffset && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchCourses(nextOffset)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
