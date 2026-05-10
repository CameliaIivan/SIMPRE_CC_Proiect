import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NavBar({ setIsLogin }) {
  const router = useRouter();

  const logoutSubmit = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-100 to-white shadow-lg">
      <div className="flex space-x-2">
        <h2 className="text-2xl font-light bg-black text-transparent bg-clip-text">
          <span className="text-4xl">C</span>loud
          <span className="text-4xl">C</span>omputing
        </h2>
        <h2 className="text-2xl font-light bg-black text-transparent bg-clip-text">
          <span className="text-4xl">A</span>pp
        </h2>
      </div>
      <ul className="flex space-x-8">
        <li>
          <Link href="/notes" className="text-x1 text-black hover:text-green-500 transition">
            Home
          </Link>
        </li>
        <li>
          <Link href="/notes/create" className="text-x1 text-black hover:text-green-500 transition">
            Create Note
          </Link>
        </li>
        <li>
          <Link href="/notes/about" className="text-x1 text-black hover:text-green-500 transition">
            About
          </Link>
        </li>
        <li>
          <button
            onClick={logoutSubmit}
            className="text-x1 text-black hover:text-green-500 transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}