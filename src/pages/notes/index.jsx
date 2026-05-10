import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavBar from '../../components/NavBar';

export default function Notes({ setIsLogin }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          router.push('/login');
          return;
        }
        const res = await fetch('/api/noteCtrl', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await res.json();
        console.log('Fetched notes:', data);
        setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
        router.push('/login');
      }
    };
    fetchNotes();
  }, [router]);

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/noteCtrl?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      router.push('/login');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <NavBar setIsLogin={setIsLogin} />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-white to-blue-500">
        <section className="max-w-7xl mx-auto mt-4 flex flex-wrap justify-around p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {notes.length === 0 ? (
            <div className="text-center w-full">
              <p className="text-gray-200 text-lg mb-4 drop-shadow-md">No notes found. Create a new note!</p>
              <Link href="/notes/create" className="bg-black text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">
                Create New Note
              </Link>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="w-72 bg-gradient-to-br from-gray-400 to-blue-800 text-white shadow-md p-4 m-4 relative rounded-xl"
              >
                <h4 className="truncate text-lg font-semibold">{note.title}</h4>
                <div className="h-36 overflow-hidden">
                  <p className="text-gray-300">{note.content}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">{formatDate(note.date)}</span>
                  <Link href={`/notes/edit/${note._id}`} className="text-blue-300 hover:text-blue-500 transition">
                    Edit
                  </Link>
                </div>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="absolute top-0 right-2 text-red-400 font-bold hover:text-red-600 transition"
                >
                  X
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}