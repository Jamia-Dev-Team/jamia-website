import React, { useEffect, useState } from "react";

import cookies from "js-cookie";

export default function Login() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const login = async () => {
    setVerifying(true);
    console.log(data);
    console.log('url',`${process.env.NEXT_PUBLIC_PORT}/api/auth/login`);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/auth/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            serverUsername: data[0]?.username,
            serverPassword: data[0]?.password,
          }),
        }
      );
      if (res.ok) {
        // Redirect to the admin dashboard or another page
        cookies.set("admin", "true");
        window.location.href = "/admin/dashboard";
        setVerifying(false);
        // redirect('/admin/dashboard')
      } else {
        // Handle login error, e.g., show an error message
        setVerifying(false);
        setWrong(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth`, {});
      const { data } = await res.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-screen bg-emerald-500 flex justify-center items-center">
      <div className="bg-white w-10/12 md:w-6/12 lg:w-4/12 p-8 rounded">
        <div className="mt-6">
          <input
            className="border border-gray-400 rounded w-full p-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="mt-5">
            <input
              className="border border-gray-400 rounded w-full p-2"
              placeholder="Password"
              type={!showPw ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
          </div>

          <button
            onClick={() => setShowPw(!showPw)}
            className="text-right mt-1 text-sm   float-right"
          >
            {showPw ? "Hide Password" : "Show Password"}
          </button>
          <button
            disabled={verifying || !username || !password}
            className="mt-6 w-full bg-emerald-500 text-white rounded p-2"
            onClick={login}
          >
            {verifying ? "VERIFYING.." : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
}
