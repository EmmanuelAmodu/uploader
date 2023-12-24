import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username: credentials.username,
      password: credentials.password,
    });
    if (!result.error) {
      router.push('/');
    } else {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-8 rounded shadow-lg max-w-md mx-auto my-10">
      <input 
        name="username" 
        className="block w-full px-4 py-2 border rounded"
        type="text" 
        value={credentials.username} 
        onChange={handleChange} 
        placeholder="Username/Email" 
      />
      <input 
        className="block w-full px-4 py-2 border rounded"
        name="password" 
        type="password" 
        value={credentials.password} 
        onChange={handleChange} 
        placeholder="Password" 
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Log In</button>
    </form>
  );
}
