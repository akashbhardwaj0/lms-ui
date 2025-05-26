import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { dummyCourses } from "../assets/assets";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = JSON.parse(localStorage.getItem("authToken"));
  console.log(authToken);


  // Function to fetch user details
  const fetchUserData = async ()=>{
    if (!authToken) return;
  
      try {
        const response = await fetch(backendUrl+"/api/user/data",{
          method: "GET",
          headers:{
            Authorization: authToken
          }
        })
        const result = await response.json();
        if(result.success){
          setUserData(result.user)
        }else{
          console.log(result.message)
          toast.success(result.message)
        }
        
      } catch (error) {
        console.log(error)
        toast.error(error)
        
      }
    }

  // Function to fetch all Course Data
  const fetchAllCourses = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/course/all`);

      const result = await response.json();

      if (result.success) {
        setAllCourses(result.courses);
      } else {
        console.log(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to Calculate average rating of course
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length)
  };

  // Function to create course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate total no of Lecture in course

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch user enrolled courses

  const fetchUserEnrolledCourses = async () => {
    try {
      const response = await fetch(backendUrl + "/api/user/enrolled-courses", {
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      });

      const result = await response.json();
      if (!result.success) {
        console.log(result.message);
        toast.error(result.message)
      }

      setEnrolledCourses(result.enrolledCourses);
      toast.success(result.message)
    } catch (error) {
      console.log(error);
      toast.error(error)
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (authToken && user) {
      fetchUserData();

      if (user.role === "educator") {
        setIsEducator(true);
      }

      fetchUserEnrolledCourses();
    }
  }, [authToken]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    authToken,
    setUserData,
    fetchAllCourses,
    user

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
