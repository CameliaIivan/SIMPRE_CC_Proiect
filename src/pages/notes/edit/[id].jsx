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
      <main className="dreamy-page flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-pink-400">Pretty planner</p>
            <h1 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-5xl font-black text-transparent">
              Edit Note
            </h1>
          </div>
          {error && <p className="mb-5 rounded-2xl bg-rose-100 p-4 text-center font-semibold text-rose-600">{error}</p>}
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
              Update Note ✨
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}