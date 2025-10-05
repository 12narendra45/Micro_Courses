
import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../api';

export default function AdminCourseStats({ courseId }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setError('');
      try {
        const res = await fetchAPI(`/admin/course/${courseId}/stats`, 'GET');
        setStats(res);
      } catch (err) {
        setError(err?.message || 'Failed to load stats');
      }
    }
    fetchStats();
  }, [courseId]);

  if (error) return <div className="text-red-500 mb-2">{error}</div>;
  if (!stats) return <div className="text-gray-400 mb-2">Loading stats...</div>;

  return (
    <div className="bg-gray-100 p-2 rounded mt-2">
      <div className="text-sm text-gray-700">Enrolled Learners: <span className="font-bold">{stats.enrolledCount}</span></div>
      <div className="text-sm text-gray-700">Certificates Issued: <span className="font-bold">{stats.certificateCount}</span></div>
      {stats.learners && stats.learners.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-600">View Learners</summary>
          <ul className="list-disc pl-4">
            {stats.learners.map(l => (
              <li key={l._id} className="text-xs text-gray-600">{l.name} ({l.email}) {l.certificateIssued ? '✅' : ''}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
