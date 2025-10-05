
import React, { useState } from 'react';
import { fetchAPI } from '../api';

export default function LessonManager({ courseId, lessonLimit, onUpdate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [transcript, setTranscript] = useState('');
  const [order, setOrder] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);

  React.useEffect(() => {
    async function fetchLessonCount() {
      try {
        const res = await fetchAPI(`/courses/${courseId}`, 'GET');
        const count = res.course?.lessons?.length || 0;
        setAddedCount(count);
        setOrder(count + 1);
        if (lessonLimit && count >= lessonLimit) {
          setShowUpdate(true);
        }
      } catch (err) {
        throw err;
      }
    }
    fetchLessonCount();
  }, [courseId, lessonLimit]);

  const handleAddLesson = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await fetchAPI(`/creator/courses/${courseId}/lessons`, 'POST', { title, content, transcript, order });
      setTitle('');
      setContent('');
      setTranscript('');
      setSuccess('Lesson added!');
      try {
        const res = await fetchAPI(`/courses/${courseId}`, 'GET');
        const count = res.course?.lessons?.length || 0;
        setAddedCount(count);
        setOrder(count + 1);
        if (lessonLimit && count >= lessonLimit) {
          setShowUpdate(true);
        }
      } catch (err) {
   
      }
    } catch (err) {
      setError(err?.message || 'Failed to add lesson');
    }
  };

  return (
    <>
      {!showUpdate && (!lessonLimit || addedCount < lessonLimit) && (
        <form className="mt-4 bg-gray-100 p-4 rounded" onSubmit={handleAddLesson}>
          <h3 className="font-semibold mb-2">Add Lesson</h3>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <input
            type="text"
            placeholder="Lesson Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mb-2 px-2 py-1 border rounded"
            required
          />
          <textarea
            placeholder="Lesson Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full mb-2 px-2 py-1 border rounded"
            required
          />
          <textarea
            placeholder="Lesson Transcript (optional)"
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            className="w-full mb-2 px-2 py-1 border rounded"
          />
          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={e => setOrder(Number(e.target.value))}
            className="w-full mb-2 px-2 py-1 border rounded"
            min={1}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Lesson
          </button>
        </form>
      )}
      {showUpdate && (
        <div className="mt-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={onUpdate}
          >
            Update Course
          </button>
          <div className="text-gray-500 mt-2">You can update course name or increase lesson count.</div>
        </div>
      )}
    </>
  );
}
