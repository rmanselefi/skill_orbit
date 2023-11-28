import { useEffect, useState } from "react";
import axios from "../../axios/axios";
import { Avatar, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

import InstructorRoute from "../../routes/InstructorRoute";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor-courses`
      );
      setCourses(data);
    };
    loadCourses();
  }, []);

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square"> Instructor Dashboard</h1>
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
      {courses &&
        courses.map((course) => (
          <div className="media pt-2" key={course._id}>
            <Avatar
              size={80}
              src={course.image ? course.image.Location : "/course.png"}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <Link
                    href={`/instructor/course/view/${course.slug}`}
                    className="pointer"
                  >
                    <h5 className="pt-2">{course.title}</h5>
                  </Link>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons?.length} Lessons
                  </p>
                  {course.lessons?.length < 5 ? (
                    <p className="text-warning">
                      At least 5 lessons are required to publish a course
                    </p>
                  ) : course.published ? (
                    <p className="text-success">
                      Your course is live in the marketplace
                    </p>
                  ) : (
                    <p className="text-success">
                      Your course is ready to be published
                    </p>
                  )}
                </div>
                <div className="col-md-3 mt-3 text-center">
                  {course.published ? (
                    <Tooltip title="Published">
                      <CheckCircleOutlined className="h5 pointer text-success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unpublished">
                      <CloseCircleOutlined className="h5 pointer text-warning" />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </InstructorRoute>
  );
};
export default InstructorIndex;
