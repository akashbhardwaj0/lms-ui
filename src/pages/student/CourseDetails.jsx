import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Loading from "../../components/student/Loading";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import { toast } from "react-toastify";

const CourseDetails = () => {

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(true);
  const [playerData, setPlayerData] = useState(null)



  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    user,
    userData,
    setUserData,
    authToken
  } = useContext(AppContext);

 

  const fetchCourseData = async () => {

    try {
      const response = await fetch(backendUrl+'/api/course/'+id)

      const result = await response.json()

      if(result.success){
        toast.success(result.message)
        setCourseData(result.courseData)

      }
      toast.error(result.message)
      
    } catch (error) {
      console.log(error)
      
    }
  };

const enrollCourse = async ()=>{
  console.log("enrollCourse function started");
  try {
    if(!userData){
      return toast.warn("Login to Enroll")
    }
    if(isAlreadyEnrolled){
      return toast.warn("Already Enrolled")

    }
    console.log("Sending request with courseId:", courseData._id);
    const response = await fetch(backendUrl+"/api/user/purchase",{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Origin": "http://localhost:5173",
        Authorization: authToken,
      },
      body: JSON.stringify({ courseId: courseData._id }),
    })
    console.log("Fetch complete. Status:", response.status);
    
    const result = await response.json();
    console.log("result: ", result)
  if(result.success){
    // const {session_Url} = result;
    console.log("Redirecting to:", result.session_url);
    window.location.replace(result.session_url);

    
  }else {
    toast.error(result.message || "Purchase failed!");
    console.log("Purchase error:", result.message);
  }


  } catch (error) {    
    console.error("Fetch failed:", error);

    
  }
}


  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);
  
  
  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData?.enrolledCourses?.includes(courseData._id));
    }
  }, [userData, courseData]);
  

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Function to display start ratings
  
  const starRatings = () => {
    return (
      <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
        <p>{calculateRating(courseData)}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={
                i < Math.floor(calculateRating(courseData))
                  ? assets.star
                  : assets.star_blank
              }
              alt=""
              className="w-3.5 h-3.5"
            />
          ))}
        </div>
        <p className="text-blue-600">
          ({courseData.courseRatings.length}{" "}
          {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
        </p>
        <p>
          {courseData.enrolledStudents.length}{" "}
          {courseData.enrolledStudents.length > 1 ? "students" : "student"}
        </p>
      </div>
    );
  };

  // Function to display course structure
  const courseStructure = ()=>{
    return (
      <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                    <div
                      className="flex items-center gap-2"
                      onClick={() => toggleSection(index)}
                    >
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
                            src={assets.play_icon}
                            alt="play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[15px, 21px">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p className="text-blue-500 cursor-pointer" onClick={()=>setPlayerData({
                                  videoId: lecture.lectureUrl.split('/').pop()
                                })}>
                                  Preview
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
    )
  }

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative item-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-100/70 z-0"></div>

        {/* Left Column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-[36px] text-[26px] font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* Review and ratings */}
          <div>{starRatings()}</div>

          <p className="text-sm">Course by{" "}<span className="text-blue-600 underline "> {courseData.educator.name}</span></p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            {courseStructure()}

            
          </div>
          <div className="py-3 text-sm md:text-[15px, 21px">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription,
              }}
            ></p>
          </div>
        </div>

        {/* Right Column */}

        <div className="max-w-[424px] h-[650px] z-10 shadow-[0px_4px_15px_2px_rgba(0,0,0,0.1)] rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
        {
          playerData? <YouTube videoId={playerData.videoId} opts={{playerVars:{autoplay: 1}}} iframeClassName="w-full aspect-video"/> :   <img src={courseData.courseThumbnail} alt="" />
        }
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time left clock icon"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days</span> left at this price!
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text:lg text-gray-500 line-through">
                {currency} {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount} % Off
              </p>
            </div>

            <div className="flex items-center text-sm md:text-[15px, 21px] gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"> </div>

              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              <div className="h-4 w-px bg-gray-500/40"> </div>

              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
              
            </div>
            <button onClick = {enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium  ">{isAlreadyEnrolled?'Already Enrolled':'Enroll Now'}</button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-[15px, 20px] list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
                <li>Quizzes to test your knowledge.</li>             
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
