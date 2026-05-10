import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NavBar({ setIsLogin }) {
  const router = useRouter();

  const logoutSubmit = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
    router.push('/login');
  };
   const navLinkClass =
    'rounded-full px-4 py-2 text-sm font-semibold text-pink-900 hover:bg-pink-100 hover:text-pink-600 hover:shadow-sm';

  return (
    <nav className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-5 py-4 shadow-lg shadow-pink-200/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/notes" className="group flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 text-2xl shadow-lg shadow-pink-300/50 group-hover:scale-105">
            ♡
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-400">Pretty Notes</p>
            <h2 className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-2xl font-black text-transparent">
              Cloud Computing App
            </h2>
          </div>
        </Link>
        <ul className="flex flex-wrap items-center gap-2 md:justify-end">
          <li>
            <Link href="/notes" className={navLinkClass}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes/create" className={navLinkClass}>
              Create Note
            </Link>
          </li>
          <li>
            <Link href="/notes/about" className={navLinkClass}>
              About
            </Link>
          </li>
          <li>
            <button onClick={logoutSubmit} className={`${navLinkClass} bg-pink-50`}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}