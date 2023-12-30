import React, { useEffect, useState } from "react";
import axios from "../axios/axios";
import course from "../../server/models/course";
import CourseCard from "../components/cards/CourseCard";

const Index = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/courses`
      );
      setCourses(data);
    };
    loadCourses();
  }, []);
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Online Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Index;
