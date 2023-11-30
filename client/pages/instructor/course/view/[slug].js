import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "../../../../axios/axios";
import InstructorRoute from "../../../../routes/InstructorRoute";
import { Avatar, Tooltip, Button, Modal } from "antd";
import ReactMarkdown from "react-markdown";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const { slug } = useRouter().query;

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}`
    );
    setCourse(data);
  };

  return (
    <InstructorRoute>
      {/* <h1>{JSON.stringify(course)}</h1> */}
      {course && (
        <div className="container-fluid pt-1">
          <div className="media pt-2">
            <Avatar
              size={80}
              src={course.image ? course.image.Location : "/course.png"}
            />

            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <h5 className="mt-2 text-primary">{course.title}</h5>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons && course.lessons.length} Lessons
                  </p>
                  <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                    {course.category}
                  </p>
                </div>

                <div className="d-flex pt-4 col">
                  <Tooltip title="Edit">
                    <EditOutlined className="h5 pointer text-warning mr-4" />
                  </Tooltip>
                  <Tooltip title="Publish">
                    <CheckOutlined className="h5 pointer text-danger" />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
          </div>
          <div className="row">
            <Button
              className="col-md-4 offset-md-4 mt-3 mb-5"
              type="primary"
              shape="round"
              size="large"
              icon={<UploadOutlined />}
              onClick={() => setVisible(true)}
            >
              Add Lesson
            </Button>

            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <div className="container pt-3">
                <form>
                  <input
                    type="text"
                    className="form-control square"
                    placeholder="Title"
                    autoFocus
                  />
                  <textarea
                    className="form-control mt-3 mb-3"
                    cols="7"
                    rows="7"
                    placeholder="Description"
                  ></textarea>
                  <div className="d-grid gap-2">
                    <Button
                      className="col mt-3"
                      type="primary"
                      size="large"
                      shape="round"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
