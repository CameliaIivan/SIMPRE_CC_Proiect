import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../../components/NavBar';

export default function EditNote({ setIsLogin }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        setError('Invalid note ID');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          router.push('/login');
          return;
        }
        const res = await fetch(`/api/noteCtrl?id=${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('GET response status:', res.status);
        if (!res.ok) {
          const errorData = await res.json();
          console.log('GET error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch note');
        }
        const data = await res.json();
        console.log('Fetched note:', data);
        if (data && typeof data === 'object' && data.title && data.content) {
          setTitle(data.title);
          setContent(data.content);
          setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : '');
        } else {
          throw new Error('Invalid note data');
        }
      } catch (err) {
        console.error('Error fetching note:', err);
        setError(err.message || 'Failed to load note. Please try again.');
      }
    };
    fetchNote();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/noteCtrl?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content, date }),
      });
      console.log('PUT response status:', res.status);
      if (res.ok) {
        router.push('/notes');
      } else {
        const data = await res.json();
        console.log('PUT error response:', data);
        setError(data.message || 'Failed to update note');
      }
    } catch (err) {
      console.error('Error updating note:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar setIsLogin={setIsLogin} />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-white to-blue-400">
        <div className="max-w-lg mx-auto p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">Edit Note</h1>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-400 to-blue-800 rounded-xl shadow-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                rows="5"
                placeholder="Write your note here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Update Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}