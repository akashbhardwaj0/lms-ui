  import { useContext, useState } from "react";
  import { AppContext } from "../context/AppContext";

  export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {navigate } = useContext(AppContext);



    const handleSignup = async (e) => {
      e.preventDefault();
    
      if (!name || !email || !role || !password) {
        setError("All fields are required");
        return;
      }
    
      try {
           
        const response = await fetch("http://localhost:5000/api/user/register", 
          {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({name, email, role, password, profilePhoto })
         });
    
        const result = await response.json();
    
        if (response.ok) {
          alert(result.message || "Sign up successful!");
          localStorage.setItem('authToken', JSON.stringify(result.authToken))
          localStorage.setItem("user", JSON.stringify(result.user))
          setError("");
          navigate("/");
        } else {
          setError(result.message || "Signup failed.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        setError("An error occurred. Please try again later.");
      }
    };
    
    

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSignup}className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" >
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            // required
          />

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Role</label>
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

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    );
  }
