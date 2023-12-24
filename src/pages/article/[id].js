import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

function Entry() {
  const { data: session, status } = useSession();
  const [entry, setEntry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      fetch(`/api/upload/${router.query.id}`)
        .then((res) => res.json())
        .then((data) => {
          setEntry(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load entries", error);
          setIsLoading(false);
        });
    }
  }, [session, router.query.id]);

  if (status === "loading") {
    return <div className="spacing">Loading... <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Go Back</Link></div>;
  }

  if (!session) {
    return <div className="spacing">You must be signed in to view entries. <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Go Back</Link></div>;
  }

  return (
    <div>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Go Back</Link>
      {isLoading ? (
        <div>Loading entries...</div>
      ) : (
        <>
          <h3 className="text-xl font-bold">{entry.title}</h3>
          <p className="mt-2">{entry.description}</p>
          <Image src={entry.filepath} alt={entry.title} width={300} height={200} className="mt-4 max-w-full h-auto rounded"/>
        </>
      )}
    </div>
  );
}

export default Entry;
