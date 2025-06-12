import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/student/Navbar";
import { ToastContainer } from "react-toastify";

// Correct Tailwind import (assuming Tailwind is set up)
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css"; // Ensure Toast styles are applied
import Loading from "./components/student/Loading";

// ✅ Lazy load all page components to reduce initial load time
const Home = lazy(() => import("./pages/student/Home"));
const CoursesList = lazy(() => import("./pages/student/CoursesList"));
const CourseDetails = lazy(() => import("./pages/student/CourseDetails"));
const MyEnrollments = lazy(() => import("./pages/student/MyEnrollments"));
const Player = lazy(() => import("./pages/student/Player"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));

const Educator = lazy(() => import("./pages/educator/Educator"));
const Dashboard = lazy(() => import("./pages/educator/Dashboard"));
const AddCourse = lazy(() => import("./pages/educator/AddCourse"));
const MyCourses = lazy(() => import("./pages/educator/MyCourses"));
const StudentsEnrolled = lazy(() => import("./pages/educator/StudentsEnrolled"));

function App() {
  const location = useLocation();

  // ✅ More reliable check for educator routes using pathname
  const isEducatorRoute = location.pathname.startsWith("/educator");

  return (
    <div className="text-[15px, 21px] min-h-screen bg-white">
      {/* ✅ Global toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Navbar only shown on student pages */}
      {!isEducatorRoute && <Navbar />}

      {/* ✅ Wrap routes in Suspense to handle lazy-loaded components */}
      <Suspense fallback={<Loading/>}>
        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<MyEnrollments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />

          {/* Educator Routes */}
          <Route path="/educator" element={<Educator />}>
            <Route index element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
