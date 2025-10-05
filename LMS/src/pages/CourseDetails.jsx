
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);
  const [certificate, setCertificate] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    async function fetchCourse() {
      setError('');
      try {
        const res = await fetchAPI(`/courses/${id}`, 'GET');
        setCourse(res.course);
        // Check enrollment and fetch progress for learner
        if (user && user.role === 'Learner') {
          const enrollRes = await fetchAPI(`/courses/${id}/enroll-status`, 'GET');
          setEnrolled(enrollRes.enrolled);
          if (enrollRes.enrolled) {
            const progressRes = await fetchAPI(`/courses/${id}/progress`, 'GET');
            setProgress(progressRes.progress || 0);
            // Check certificate status
            try {
              const certRes = await fetchAPI(`/courses/${id}/certificate`, 'GET');
              setCertificate(certRes);
            } catch (e) {
              setCertificate(null);
            }
          }
        }
      } catch (err) {
        setError(err?.error?.message || 'Failed to load course');
      }
    }
    fetchCourse();
  }, [id, token, success]);

  const handleEnroll = async () => {
    setError('');
    setSuccess('');
    if (!user) {
      setError('Please login to enroll in this course.');
      return;
    }
    try {
      await fetchAPI(`/courses/${id}/enroll`, 'POST');
      setEnrolled(true);
      setSuccess('Enrolled successfully!');

      const progressRes = await fetchAPI(`/courses/${id}/progress`, 'GET');
      setProgress(progressRes.progress || 0);

    } catch (err) {
      setError(err?.error?.message || 'Enrollment failed');
    }
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-4">By: {course.creator?.name || 'Unknown'}</p>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        {!enrolled && (
          <button
            onClick={handleEnroll}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-6"
          >
            Enroll
          </button>
        )}

        {/* Progress Bar for Learner */}
        {enrolled && user?.role === 'Learner' && (
          <div className="my-6">
            <div className="text-sm mb-2">Progress: {progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              >
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <h2 className="text-xl font-semibold mb-2">Lessons</h2>
        <ul className="list-disc pl-6">
          {course.lessons?.map(lesson => (
            <li key={lesson._id} className="mb-2">
              <a
                href={`/learn/${lesson._id}`}
                className="text-blue-600 hover:underline"
              >
                {lesson.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Mark as Complete Button for Learner */}
        {enrolled && user?.role === 'Learner' && !certificate && (
          <button
            onClick={async () => {
              setError('');
              setSuccess('');
              try {
                await fetchAPI(`/courses/${id}/complete`, 'POST');
                
                try {
                  await fetchAPI(`/courses/${id}/certificate`, 'POST');
                  const certRes = await fetchAPI(`/courses/${id}/certificate`, 'GET');
                  setCertificate(certRes);
                  setSuccess('Course marked as complete! Certificate generated.');
                } catch (e) {
                  setSuccess('Course marked as complete! Certificate will be generated if all lessons are done.');
                }
              } catch (err) {
                setError(err?.message || 'Failed to mark as complete');
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mt-6"
          >
            Mark Course as Complete
          </button>
        )}
        
        {certificate && (
          <div className="mt-6">
            <a
              href={`/certificate/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              View/Download Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
