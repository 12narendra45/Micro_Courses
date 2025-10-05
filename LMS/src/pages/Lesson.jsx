
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPI } from '../api';

export default function Lesson() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchLesson() {
      setError('');
      try {
        const res = await fetchAPI(`/learn/${lessonId}`, 'GET');
        setLesson(res.lesson);
        
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.role === 'Learner') {
          const enrollRes = await fetchAPI(`/courses/${res.lesson.course}/enroll-status`, 'GET');
          if (enrollRes.enrolled) {
            const progressRes = await fetchAPI(`/progress`, 'GET');
            const enrollment = progressRes.progress?.find(e => e.course?._id === res.lesson.course);
            if (enrollment && enrollment.completedLessons?.some(l => l._id === lessonId)) {
              setCompleted(true);
            }
          }
        }
      } catch (err) {
        setError(err?.message || 'Failed to load lesson');
      }
    }
    fetchLesson();
  }, [lessonId, token]);

  if (!lesson) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-2xl font-bold mb-2">
          Lesson {lesson.order ? `#${lesson.order}` : ''}: {lesson.title}
        </h1>
        <div className="mb-4 text-gray-700 whitespace-pre-line">{lesson.content}</div>
        <h2 className="text-lg font-semibold mb-2">Transcript</h2>
        <div className="bg-gray-100 p-4 rounded text-gray-600 whitespace-pre-line">{lesson.transcript || 'Transcript not available.'}</div>
        <button
          disabled={completed}
          onClick={async () => {
            setError('');
            try {
              await fetchAPI(`/learn/${lessonId}/complete`, 'POST');
              setCompleted(true);
              setError('Lesson marked as complete! Progress updated.');
            } catch (err) {
              setError(err?.message || 'Failed to mark lesson as complete');
            }
          }}
          className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mt-6 ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {completed ? 'Completed' : 'Mark Lesson as Complete'}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
