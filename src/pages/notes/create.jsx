import { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';

export default function CreateNote({ setIsLogin }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (title.trim().length < 1 || content.trim().length < 1) {
      alert('Title and content must be at least 1 character long');
      return;
    }
    console.log('Sending request with token:', token);
    console.log('Request body:', { title, content, date });
    try {
      const res = await fetch('/api/noteCtrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content, date }),
      });
      const responseData = await res.json();
      console.log('Response status:', res.status);
      console.log('Response data:', responseData);
      if (res.ok) {
        router.push('/notes');
      } else {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setIsLogin(false);
          router.push('/login');
        } else {
          alert('Failed to create note: ' + (responseData.message || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Failed to create note: Network error');
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar setIsLogin={setIsLogin} />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-white to-blue-400">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">Create a New Note</h1>
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-400 to-blue-800 rounded-x1 shadow-2xl p-9 space-y-6">
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
              Create Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}