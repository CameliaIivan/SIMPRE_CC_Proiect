import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login({ setIsLogin }) {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/users/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setIsLogin(data);
          if (!data) {
            localStorage.removeItem('token');
            router.push('/login');
          } else {
            router.push('/notes');
          }
        } catch (err) {
          setIsLogin(false);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        setIsLogin(false);
      }
    };
    checkLogin();
  }, [setIsLogin, router]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErr('');
    setSuccess('');
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending request to /api/users/register');
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.name,
          email: user.email,
          password: user.password,
        }),
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.msg);
        setTimeout(() => setShowLogin(true), 2000);
      } else {
        setErr(data.message || 'Registration failed');
      }
    } catch (err) {
      setErr('An error occurred. Please try again.');
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login submit triggered');
    try {
      console.log('Sending request to /api/users/login');
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });
      console.log('Response status:', res.status);
      const data = await res.json();
      if (res.ok) {
        setUser({ name: '', email: '', password: '' });
        localStorage.setItem('token', data.token);
        setIsLogin(true);
        router.push('/notes');
      } else {
        setErr(data.message || 'Login failed');
      }
    } catch (err) {
      setErr('An error occurred. Please try again.');
    }
  };

  return (
    <section className="dreamy-page flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card relative w-full max-w-md overflow-hidden rounded-[2rem] p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-200/60 blur-2xl" />
        <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-fuchsia-200/50 blur-2xl" />
        <div className="relative mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 text-3xl shadow-xl shadow-pink-300/50">
            ✿
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-400">Cloud Notes</p>
          <h1 className="mt-2 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-4xl font-black text-transparent">
            {showLogin ? 'Welcome back' : 'Join the sparkle'}
          </h1>
          <p className="mt-2 text-sm text-pink-900/70">
            {showLogin ? 'Plan your day in a soft, dreamy workspace.' : 'Create your account and start saving pretty notes.'}
          </p>
        </div>
        {showLogin ? (
          <form onSubmit={loginSubmit} className="relative space-y-5">
            <h3 className="text-2xl font-bold text-center">Log in</h3>
            <div>
              <label className="mb-2 block text-sm font-bold text-pink-900">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={onChangeInput}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-pink-900">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={onChangeInput}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            <div className="flex items-center rounded-full bg-white/60 px-4 py-2">
              <input type="checkbox" id="remember" className="mr-2 accent-pink-500" />
              <label htmlFor="remember" className="text-sm font-medium text-pink-900/75">Remember me</label>
            </div>
            <button type="submit" className="pretty-button w-full p-3">
              Sign In ✨
            </button>
             <p className="text-center text-sm text-pink-900/75">
              Don't have an account?{' '}
              <span
                onClick={() => setShowLogin(false)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Register now
              </span>
            </p>
             {err && <p className="rounded-2xl bg-rose-100 p-3 text-center text-sm font-semibold text-rose-600">{err}</p>}
            {success && <p className="rounded-2xl bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-600">{success}</p>}
          </form>
        ) : (
         <form onSubmit={registerSubmit} className="relative space-y-5">
            <h3 className="text-2xl font-bold text-center">Register</h3>
            <div>
             <label className="mb-2 block text-sm font-bold text-pink-900">Username</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={onChangeInput}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-pink-900">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={onChangeInput}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-pink-900">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={onChangeInput}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="pretty-button w-full p-3">
              Register ✨
            </button>
            <p className="text-center text-sm text-pink-900/75">
              Have an account?{' '}
              <span
                onClick={() => setShowLogin(true)}
                className="cursor-pointer font-bold text-pink-600 hover:text-fuchsia-600"
              >
                Login now
              </span>
            </p>
             {err && <p className="rounded-2xl bg-rose-100 p-3 text-center text-sm font-semibold text-rose-600">{err}</p>}
            {success && <p className="rounded-2xl bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-600">{success}</p>}
          </form>
        )}
      </div>
    </section>
  );
}