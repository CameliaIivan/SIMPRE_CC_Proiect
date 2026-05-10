import NavBar from '../../components/NavBar';

export default function About({ setIsLogin }) {
  return (
    <div className="min-h-screen">
      <NavBar setIsLogin={setIsLogin} />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-white to-blue-400">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">About This App</h1>
          <div className="bg-gradient-to-br from-gray-400 to-blue-800 rounded-xl shadow-2xl p-8 text-gray-200">
            <p className="text-lg mb-4">
              Welcome to <span className="font-semibold text-blue-700">Aplicatie Cloud Computing</span>, a sleek and modern note-taking application built with Next.js and MongoDB.
            </p>
            <p className="text-lg mb-4">
              This app allows you to create, edit, and manage your notes with ease. Whether you're jotting down ideas, planning your day, or keeping track of important tasks, we've got you covered.
            </p>
            <p className="text-lg">
              Features include:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Secure user authentication</li>
                <li>Easy note creation and editing</li>
                <li>Customizable note dates</li>
                <li>Responsive and modern design</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}