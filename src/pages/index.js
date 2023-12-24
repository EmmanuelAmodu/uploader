import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/upload')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setEntries(data.uploads);
        });
    }
  }, [session]);

  return (
    <div>
      <nav>
        {!session && (
          <div className="spacing">
            <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Sign In</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Register</Link>
          </div>
        )}
        {session && (
          <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Sign Out</button>
        )}
      </nav>
      <main>
        <h1>Welcome to the Articles App!</h1>
        {session && (
          <section className="flex flex-col space-y-4 bg-white p-8 rounded shadow-lg max-w-md mx-auto my-10">
            <h2 className="text-2xl font-semibold mb-4">Entries</h2>
            <ul className="space-y-4">
              {entries.map((entry) => (
                <li key={entry._id} className="bg-white p-4 rounded shadow">
                  <Link href={`/article/${entry._id}`} >{entry.title}</Link>
                </li>
              ))}
            </ul>
            <Link href="/article/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Create Article</Link>
          </section>
        )}
        {!session && <p className="mt-2">Please sign in to view entries.</p>}
      </main>
    </div>
  );
}
