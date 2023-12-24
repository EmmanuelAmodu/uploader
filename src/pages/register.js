import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("User registered:", data);
      router.push('/login');
    } else {
      console.error("Registration failed:", data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-8 rounded shadow-lg max-w-md mx-auto my-10">
      <input
        className="block w-full px-4 py-2 border rounded"
        name="username"
        type="text"
        value={userInfo.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        className="block w-full px-4 py-2 border rounded"
        name="email"
        type="email"
        value={userInfo.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        className="block w-full px-4 py-2 border rounded"
        name="password"
        type="password"
        value={userInfo.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Register</button>
    </form>
  );
}
