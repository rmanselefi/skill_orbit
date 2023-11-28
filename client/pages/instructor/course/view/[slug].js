import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import InstructorRoute from "../../../../routes/InstructorRoute";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const { slug } = useRouter().query;

  useEffect(() => {
    console.log(slug);
  }, []);
  return (
    <InstructorRoute>
      <h1>{slug}</h1>
    </InstructorRoute>
  );
};

export default CourseView;
