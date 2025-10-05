
import React, { useEffect, useState } from 'react';

import { fetchAPI } from '../api';

export default function CreatorDashboard() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [showLessonPrompt, setShowLessonPrompt] = useState(false);
  const [lessonCount, setLessonCount] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [lessonInputs, setLessonInputs] = useState([]);
  const [newCourseId, setNewCourseId] = useState(null);
  const token = localStorage.getItem('token');

  
  const fetchCourses = async () => {
    setError('');
    try {
      const res = await fetchAPI('/creator/courses', 'GET');
      setCourses(res.items || []);
    } catch (err) {
      setError(err?.message || 'Failed to load courses');
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);


  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetchAPI('/creator/courses', 'POST', { title, description });
      setTitle('');
      setDescription('');
      setSuccess('Course created!');
      setNewCourseId(res.course?._id || res._id);
      setShowLessonPrompt(true);
      setLessonInputs([]);
      setCurrentLessonIdx(0);
      fetchCourses();
    } catch (err) {
      setError(err?.message || 'Failed to create course');
    }
  };


  const handleLessonCountConfirm = e => {
    e.preventDefault();
  setLessonInputs(Array.from({ length: lessonCount }, () => ({ title: '', content: '', transcript: '', submitted: false })));
    setShowLessonPrompt(false);
    setCurrentLessonIdx(0);
  };

  const handleLessonInputChange = (field, value) => {
    setLessonInputs(inputs => {
      const updated = [...inputs];
      updated[currentLessonIdx][field] = value;
      return updated;
    });
  };

  const handleLessonSubmit = async () => {
    const lesson = lessonInputs[currentLessonIdx];
    if (!lesson.title || !lesson.content) return;
    try {
      await fetchAPI(`/creator/courses/${newCourseId}/lessons`, 'POST', {
        title: lesson.title,
        content: lesson.content,
        transcript: lesson.transcript,
        order: currentLessonIdx + 1
      });
      setLessonInputs(inputs => {
        const updated = [...inputs];
        updated[currentLessonIdx].submitted = true;
        return updated;
      });
      setSuccess(`Lesson ${currentLessonIdx + 1} added!`);
      fetchCourses();
      if (currentLessonIdx + 1 < lessonCount) {
        setCurrentLessonIdx(currentLessonIdx + 1);
      } else {
        setCurrentLessonIdx(lessonCount); 
      }
    } catch (err) {
      setError(err?.message || 'Failed to add lesson');
    }
  };
 
  const handleDelete = async id => {
    setError('');
    setSuccess('');
    try {
      await fetchAPI(`/creator/courses/${id}`, 'DELETE');
      setSuccess('Course deleted!');
      fetchCourses();
    } catch (err) {
      setError(err?.message || 'Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Creator Dashboard</h1>
      <form className="bg-white p-6 rounded shadow mb-8 max-w-xl mx-auto" onSubmit={handleCreate}>
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Course
        </button>
      </form>
      
      {showLessonPrompt && (
        <form className="bg-white p-6 rounded shadow mb-8 max-w-xl mx-auto" onSubmit={handleLessonCountConfirm}>
          <h2 className="text-xl font-semibold mb-4">How many lessons do you want to add?</h2>
          <input
            type="number"
            min={1}
            value={lessonCount}
            onChange={e => setLessonCount(Number(e.target.value))}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Confirm
          </button>
        </form>
      )}

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        {courses.length === 0 ? (
          <div className="text-gray-600">No courses yet.</div>
        ) : (
          <ul className="space-y-4">
            {[...courses].reverse().map(course => (
              <li key={course._id} className="bg-white p-4 rounded shadow flex flex-col">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{course.title}</div>
                    <div className="text-gray-700">{course.description}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
      
                {course._id === newCourseId && lessonInputs.length > 0 && (
                  <div className="bg-gray-100 p-4 rounded mt-4">

                    {currentLessonIdx < lessonCount ? (
                      <>
                        <h3 className="font-semibold mb-2">Add Lesson {currentLessonIdx + 1} of {lessonCount}</h3>
                        <input
                          type="text"
                          placeholder={`Lesson ${currentLessonIdx + 1} Title`}
                          value={lessonInputs[currentLessonIdx]?.title || ''}
                          onChange={e => handleLessonInputChange('title', e.target.value)}
                          className="w-full mb-2 px-3 py-2 border rounded"
                          disabled={lessonInputs[currentLessonIdx]?.submitted}
                          required
                        />

                        <textarea
                          placeholder={`Lesson ${currentLessonIdx + 1} Topics`}
                          value={lessonInputs[currentLessonIdx]?.content || ''}
                          onChange={e => handleLessonInputChange('content', e.target.value)}
                          className="w-full mb-2 px-3 py-2 border rounded"
                          disabled={lessonInputs[currentLessonIdx]?.submitted}
                          required
                        />

                        <textarea
                          placeholder={`Lesson ${currentLessonIdx + 1} Transcript (optional)`}
                          value={lessonInputs[currentLessonIdx]?.transcript || ''}
                          onChange={e => handleLessonInputChange('transcript', e.target.value)}
                          className="w-full mb-2 px-3 py-2 border rounded"
                          disabled={lessonInputs[currentLessonIdx]?.submitted}
                        />
                        
                        <button
                          type="button"
                          className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${lessonInputs[currentLessonIdx]?.submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleLessonSubmit}
                          disabled={lessonInputs[currentLessonIdx]?.submitted}
                        >
                          {lessonInputs[currentLessonIdx]?.submitted ? 'Lesson Added' : 'Add Lesson'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-green-600 font-semibold mb-2">All lessons added!</div>
                        <ul className="list-disc pl-6">
                          {lessonInputs.map((lesson, idx) => (
                            <li key={idx} className="text-gray-800 mb-1">{lesson.title}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
