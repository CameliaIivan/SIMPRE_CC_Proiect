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
      <main className="dreamy-page flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-pink-400">Pretty planner</p>
            <h1 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-5xl font-black text-transparent">
              Create a New Note
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="glass-card relative overflow-hidden rounded-[2rem] p-8 space-y-6">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-pink-200/70 blur-2xl" />
            <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-fuchsia-200/60 blur-2xl" />
            <div className="relative">
              <label className="mb-2 block text-sm font-bold text-pink-900">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Enter note title"
                required
              />
            </div>
            <div className="relative">
              <label className="mb-2 block text-sm font-bold text-pink-900">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                rows="5"
                placeholder="Write your note here..."
                required
              />
            </div>
            <div className="relative">
              <label className="mb-2 block text-sm font-bold text-pink-900">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
            <button type="submit" className="pretty-button relative w-full p-3">
              Create Note ✨
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}