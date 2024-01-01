import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserRoute from "../../../routes/UserRoutes";
import axios from "../../../axios/axios";
import StudentRoute from "../../../routes/StudentRoute";
import { Button, Menu } from "antd";
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";

const SingleCourse = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState({
    lessons: [],
  });
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/course/${slug}`
      );
      setCourse(data);
    } catch (error) {
      console.log(error);
      setCourse({});
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div
          style={{
            maxWidth: 320,
          }}
        >
          <Button
            className="text-primary mt-1 btn-bock mb-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{
              height: "100vh",
              overflowY: "scroll",
            }}
          >
            {course.lessons.map((lesson, index) => (
              <Menu.Item
                onClick={() => setClicked(index)}
                key={lesson._id}
                icon={<PlayCircleOutlined />}
              >
                {lesson.title.substring(0, 30)}
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              {course.lessons[clicked].video && (
                <div className="wrapper">
                  <ReactPlayer
                    url={course.lessons[clicked].video.Location}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
              )}
              <ReactMarkdown>{course.lessons[clicked].content}</ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
