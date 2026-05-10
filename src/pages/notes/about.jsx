import NavBar from '../../components/NavBar';

export default function About({ setIsLogin }) {
  return (
    <div className="min-h-screen">
      <NavBar setIsLogin={setIsLogin} />
   <main className="dreamy-page flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-pink-400">About the app</p>
            <h1 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-clip-text text-5xl font-black text-transparent">
              A prettier place for your thoughts
            </h1>
          </div>
          <div className="glass-card relative overflow-hidden rounded-[2rem] p-8 text-pink-950/75 md:p-10">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-pink-200/70 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-fuchsia-200/60 blur-2xl" />
            <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="space-y-5 text-lg leading-8">
                <p>
                  Welcome to <span className="font-black text-pink-600">Aplicatie Cloud Computing</span>, a soft and modern note-taking application built with Next.js and MongoDB.
                </p>
                <p>
                  Create, edit, and manage your notes with ease—perfect for jotting down ideas, planning your day, or saving tiny reminders that deserve a little sparkle.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/60 p-6 shadow-inner shadow-pink-100">
                <h2 className="mb-4 text-xl font-black text-pink-950">Features</h2>
                <ul className="space-y-3 text-sm font-semibold text-pink-950/75">
                  <li className="rounded-full bg-pink-50 px-4 py-3">♡ Secure user authentication</li>
                  <li className="rounded-full bg-pink-50 px-4 py-3">♡ Easy note creation and editing</li>
                  <li className="rounded-full bg-pink-50 px-4 py-3">♡ Customizable note dates</li>
                  <li className="rounded-full bg-pink-50 px-4 py-3">♡ Responsive, dreamy design</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
  );
}
