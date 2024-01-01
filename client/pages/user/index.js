import { useEffect, useState, useContext } from "react";

import { Context } from "../../context";
import UserRoute from "../../routes/UserRoutes";
import axios from "../../axios/axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInstructorCourses();
  }, []);

  const loadInstructorCourses = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-courses`
      );
      console.log(data);
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div>
        {loading && (
          <div className="col-md-4">
            <SyncOutlined
              spin
              className="d-flex justify-content-center display-1 text-danger p-5"
            />
          </div>
        )}
        <h1 className="jumbotron text-center bg-primary square">
          User Dashboard
        </h1>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            {courses &&
              courses.map((course) => (
                <div className="row">
                  <div className="col-md-2 media" key={course._id}>
                    <Avatar
                      size={80}
                      src={course.image ? course.image.Location : "/course.png"}
                    />
                  </div>
                  <div className="col-md-10 media-body pl-2 ">
                    <div className="row">
                      <div className="col">
                        <Link href={`/user/course/${course.slug}`}>
                          <h5 className="mt-2 text-primary">{course.title}</h5>
                        </Link>
                        <p style={{ marginTop: "-10px" }}>
                          {course.lessons.length} Lessons
                        </p>
                        <p
                          style={{ marginTop: "-10px" }}
                          className="text-muted"
                        >
                          By {course.instructor.name}
                        </p>
                      </div>
                      <div className="col-md-3 mt-3 text-center">
                        <Link href={`/user/course/${course.slug}`}>
                          <PlayCircleOutlined className="h2 pointer text-primary" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </UserRoute>
  );
};
export default UserIndex;
