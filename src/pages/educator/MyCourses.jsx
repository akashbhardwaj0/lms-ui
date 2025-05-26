import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";

const MyCourses = () => {
    const {currency, backendUrl, authToken, isEducator} = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const response =  await fetch(backendUrl+"/api/educator/courses",{
        method:"GET",
        headers:{
          Authorization: authToken,
        },
      })
      const result = await response.json()
      if(result.success){
        setCourses(result.courses)
      }else{
        toast.error(result.message)
      }
      
    } catch (error) {
      console.log(error)
      
    }
  };

  useEffect(() => {
 if(isEducator){   fetchEducatorCourses();}
  }, [isEducator]);

  return courses ? (
    <div className="min-h-screen flex flex-col items-start justify-between p-4 pt-8 pb-0 w-full">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr className="border-b border-gray-500/20">
                <th className="px-4 py-3 font-semibold truncate">All Course</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Student</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-14 sm:w-24 md:w-28"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>

                  <td className="px-4 py-3 max-sm:hidden">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice - (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
