import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import Profile from "../Profile.jsx";
import { toast } from "react-toastify";


function Navbar() {
  const [isUser, setIsUser] = useState(false)
  const {navigate, isEducator, setIsEducator, userData, authToken, backendUrl, user} = useContext(AppContext)
  const isCourseListPage = location.pathname.includes("/course-list");
  console.log(isEducator, backendUrl, user)

  const becomeEducator = async () => {
  try {
    if (isEducator) {
      navigate("/educator");
      return;  
    }
    console.log("become clicked")
    
    const response = await fetch(backendUrl + "/api/educator/update-role", {
      method: "GET",
      headers: {   
        Authorization: authToken
      },
    });

    const result = await response.json(); 

    if (result.success) {
      const updatedUser = { ...user, role: "educator" };
      // Replace user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEducator(true);
      toast.success(result.message);
    } else {
      setIsEducator(false);
      toast.error(result.message);
    }
    
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
  }
}

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={ becomeEducator} >             
                {user.role === 'educator' ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link> 
            </>
          )}
        </div>
        {user ? (
  <div className="relative">
    <img src={assets.user_icon} onClick={() => setIsUser((prev) => !prev)} className="cursor-pointer w-8 h-8 rounded-full" alt="user"/>
    {isUser && (
      <div className="absolute right-0 top-12 z-50">
        <Profile name = {user.name} email = {user.email} photoUrl ={user.logo} onEdit = {null}/>
      </div>
    )}
  </div>
) : (
  <div className="flex gap-5">
    <button
      onClick={() => navigate("/login")}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      Sign In
    </button>
    <button
      onClick={() => navigate("/sign-up")}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      Create Account
    </button>
  </div>
)}

{/* Phone Screen */}

      </div>
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
        {user && (
            <>
              <button onClick={becomeEducator}>
                {user.role === 'educator' ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}

       </div>

       {user ? (
  <div className="relative">
    <img
      src={assets.user_icon}
      onClick={() => setIsUser((prev) => !prev)}
      className="cursor-pointer w-8 h-8 rounded-full"
      alt="user"
    />
    {isUser && (
      <div className="absolute right-0 top-12 z-50 md:w-2 h-10">
        <Profile name = {user.name} email = {user.email} photoUrl ={user.logo} onEdit = {null}/>
      </div>
    )}
  </div>
) : (
  <div className="flex gap-5">
    <button
      onClick={() => navigate("/login")}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      Sign In
    </button>
    <button
      onClick={() => navigate("/sign-up")}
      className="bg-blue-600 text-white px-5 py-2 rounded-full"
    >
      Create Account
    </button>
  </div>
)}



      </div>
    </div>
  );
}

export default Navbar;
