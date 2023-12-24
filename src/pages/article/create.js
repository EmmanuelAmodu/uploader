import { useSession } from "next-auth/react";
import FileUploadForm from "../../components/FileUploadForm";
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function YourUploadPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    return <p>You need to be authenticated to view this page.</p>;
  }

  return (
    <div className="spacing">
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors spacing">Go Back</Link>
      <h1 className="text-2xl font-semibold mb-4">Upload a File</h1>
      <FileUploadForm callBack={() => router.push('/')} />
    </div>
  );
}
