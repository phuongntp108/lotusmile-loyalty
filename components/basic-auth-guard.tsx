"use client";

import { useState } from "react";

const BASIC_USER = "admin";
const BASIC_PASS = "admin123";

export default function BasicAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUser === BASIC_USER && inputPass === BASIC_PASS) {
      setAuthorized(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-lg font-bold">Basic Auth Required</h2>
          <input
            type="text"
            placeholder="Username"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
