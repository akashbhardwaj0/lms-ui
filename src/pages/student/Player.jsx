import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";


const Player = () => {
  const { courseId } = useParams();
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    authToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(null);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const response = await fetch(
        backendUrl + "/api/user/update-course-progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify({ courseId: courseId, lectureId: lectureId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        getCourseProgress()
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseProgress = async () => {
    try {
      const response = await fetch(
        backendUrl + "/api/user/get-course-progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify({ courseId }),
        }
      );
      const result = response.json();
      if (result.success) {
        setProgressData(result.progressData)
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRate = async (rating)=>{
    try {
      const response = await fetch (backendUrl+"/api/user/add-rating",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          Authorization:authToken
        },
        body:JSON.stringify({courseId, rating})
      })
      const result = response.json()

      if (result.success){
        toast.success(result.message)
        fetchUserEnrolledCourses()
      }else{
        toast.error(result.message)
      }
      
    } catch (error) {
      console.log(error)
      
    }
  }
  useEffect(()=>{
    handleRate()
  },[])
  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const courseStructure = () => {
    return (
      <div className="pt-5">
        {courseData &&
          courseData.courseContent.map((chapter, index) => (
            <div
              key={index}
              className="border border-gray-300 bg-white mb-2 rounded"
            >
              <div
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <img
                    className={`transform transition-transform ${
                      openSection[index] ? "rotate-180" : ""
                    }`}
                    src={assets.down_arrow_icon}
                    alt="arrow icon"
                  />
                  <p className="font-medium md:text-base text-sm">
                    {chapter.chapterTitle}
                  </p>
                </div>
                <p className="text-sm md:text-[15px, 21px">
                  {chapter.chapterContent.length} lectures -{" "}
                  {calculateChapterTime(chapter)}
                </p>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSection[index] ? "max-h-96" : "max-h-0"
                }`}
              >
                <ul className="list-disc md:pl-10 pl-4 py-2 pr-4 text-gray-600 border-t border-fray-300">
                  {chapter.chapterContent.map((lecture, i) => (
                    <li key={i} className="flex items-start gap-2 py-1 ">
                      <img
                        src={progressData&& progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                        alt="play icon"
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[15px, 21px">
                        <p>{lecture.lectureTitle}</p>
                        <div className="flex gap-2">
                          {lecture.lectureUrl && (
                            <p
                              className="text-blue-500 cursor-pointer"
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: index + 1,
                                  lecture: i + 1,
                                })
                              }
                            >
                              Watch
                            </p>
                          )}
                          <p>
                            {humanizeDuration(
                              lecture.calculateCourseDuration * 60 * 1000,
                              ["h", "m"]
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>{" "}
            </div>
          ))}
      </div>
    );
  };

  return courseData? (
    <>
      <div className="flex flext-col-reverse p-4 sm:p-10 md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left Column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          {courseStructure()},
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this course</h1>
            <Rating  initialRating={initialRating} onRate = {handleRate}  />

          </div>
          <div></div>
        </div>

        {/* Right column */}
        <div className="md:mt-10">
          {playerData ? (
            <YouTube
              videoId={playerData.lectureUrl.split("/").pop()}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData ? courseData.courseThumbnail : null} alt="" />
          )}
          <div className="flex justify-between items-center mt-1">
            <p>
              {playerData?.chapter}.{playerData?.lecture}{" "}
              {playerData?.lectureTitle}
            </p>
            <button onClick={()=>markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">
              {progressData&& progressData.lectureCompleted.includes(lecture.lectureId)? "completed" : "Mark Complete"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ): <Loading/>
};

export default Player;
