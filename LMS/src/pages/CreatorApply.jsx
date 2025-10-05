import React, { useState } from 'react';
import { fetchAPI } from '../api';

export default function CreatorApply() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const token = localStorage.getItem('token');

  
  const fetchUserInfo = async () => {
    try {
      const res = await fetchAPI('/auth/me', 'GET');
      localStorage.setItem('user', JSON.stringify(res.user));
      setIsApproved(res.user.isApproved);
      if (res.user.role === 'Creator' && !res.user.isApproved) {
        setIsSubmitted(true);
      } else {
        setIsSubmitted(false);
      }
    } catch (err) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsApproved(user.isApproved);
        if (user.role === 'Creator' && !user.isApproved) {
          setIsSubmitted(true);
        }
      }
    }
  };

  React.useEffect(() => {
    fetchUserInfo();
  }, []);


  const handleApply = async () => {
    setError('');
    setSuccess('');
    try {
      await fetchAPI('/creator/apply', 'POST');
      setSuccess('Application submitted! Wait for admin approval.');
      setIsSubmitted(true);

      fetchUserInfo();
    } catch (err) {
      setError(err?.message || 'Application failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Apply as Creator</h2>
        <p className="mb-4 text-gray-700">Submit your application to become a course creator. Once approved by an admin, you'll be able to create and manage courses.</p>
        {isApproved && <div className="text-green-600 mb-4">You are approved as a creator! You can now create courses.</div>}
        {isSubmitted && !isApproved && <div className="text-yellow-600 mb-4">Application already submitted. Please wait for admin approval.</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isSubmitted && !isApproved}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
