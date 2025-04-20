import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const {storeUser, navigate} = useContext(AppContext)
  
  

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError("");
    const userData = { email, password, role };
    localStorage.setItem("signIn Data", JSON.stringify(userData));
    storeUser(userData);
    console.log("Sign in with data:", userData);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Login as</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Student
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="educator"
                checked={role === "educator"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              Educator
            </label>
          </div>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={()=>navigate('/sign-up')}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
