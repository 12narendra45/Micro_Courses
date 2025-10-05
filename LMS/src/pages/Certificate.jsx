
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function Certificate() {
  const { courseId } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    async function fetchCertificate() {
      setError('');
      try {
        const res = await fetchAPI(`/courses/${courseId}/certificate`, 'GET');
        setCert(res.certificate || res);
      } catch (err) {
        setError(err?.message || 'Certificate not found or not issued yet');
      }
    }
    fetchCertificate();
  }, [courseId]);

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!cert) return <div className="min-h-screen flex items-center justify-center">Loading certificate...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Certificate of Completion</h1>
        <p className="mb-6 text-lg">This certifies that</p>
        <div className="font-bold text-2xl mb-2">{user?.name}</div>
        <p className="mb-6">has successfully completed the course</p>
        <div className="font-bold text-xl mb-2">{cert.courseTitle}</div>
        <p className="mb-6">on {new Date(cert.issuedAt || Date.now()).toLocaleDateString()}</p>
        <div className="text-gray-500 text-xs mb-4">Certificate ID: {cert.serialHash || cert._id}</div>
        
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => window.print()}
        >
          Download / Print
        </button>
      </div>
    </div>
  );
}
