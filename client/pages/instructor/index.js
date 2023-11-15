import { useEffect, useState } from "react";
import axios from "../../axios/axios";

import InstructorRoute from "../../routes/InstructorRoute";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await axios.get("/api/instructor-courses");
      setCourses(data);
    };
    loadCourses();
  }, []);

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square"> Instructor Dashboard</h1>
    </InstructorRoute>
  );
};
export default InstructorIndex;
