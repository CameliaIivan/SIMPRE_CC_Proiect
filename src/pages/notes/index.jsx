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
      <main className="dreamy-page min-h-[calc(100vh-80px)] px-4 py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-pink-400">Your soft workspace</p>
            <h1 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-5xl font-black text-transparent">
              Notes with a little sparkle
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-pink-950/70">
              Capture ideas, plans, and reminders in a cozy board made for calm productivity.
            </p>
          </div>
          {error && <p className="mx-auto mb-6 max-w-xl rounded-2xl bg-rose-100 p-4 text-center font-semibold text-rose-600">{error}</p>}
          {notes.length === 0 ? (
             <div className="glass-card mx-auto max-w-xl rounded-[2rem] p-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-4xl">♡</div>
              <p className="mb-6 text-lg font-semibold text-pink-950/75">No notes found. Create a new note!</p>
              <Link href="/notes/create" className="pretty-button inline-block px-8 py-3">
                Create New Note
              </Link>
            </div>
          ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((note) => (
                <article
                  key={note._id}
                  className="glass-card group relative overflow-hidden rounded-[1.75rem] p-5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-300/40"
                >
                 <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-200/60 blur-xl" />
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 font-black text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white"
                    aria-label={`Delete note ${note.title}`}
                  >
                    ×
                  </button>
                  <div className="relative pr-10">
                    <span className="mb-4 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-600">
                      {formatDate(note.date)}
                    </span>
                    <h4 className="truncate text-xl font-black text-pink-950">{note.title}</h4>
                    <div className="mt-4 h-36 overflow-hidden rounded-2xl bg-white/50 p-4">
                      <p className="text-sm leading-6 text-pink-950/70">{note.content}</p>
                    </div>
                    <Link href={`/notes/edit/${note._id}`} className="mt-5 inline-flex font-bold text-pink-600 hover:text-fuchsia-600">
                      Edit note →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}