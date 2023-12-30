import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "../../../../axios/axios";
import InstructorRoute from "../../../../routes/InstructorRoute";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import AddLessonForm from "../../../../components/forms/AddLessonForm";

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { query } = useRouter();
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });

  const [uploading, setUploading] = useState(false);

  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  const [slug, setSlug] = useState();

  useEffect(() => {
    if (query.slug) {
      setSlug(query.slug);
      loadCourse(query.slug);
    }
  }, [query.slug]);

  const loadCourse = async (slug) => {
    if (!slug) return;
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}`
    );
    setCourse(data);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: "", content: "", video: {} });

      setVisible(false);
      setUploadButtonText("Upload Video");
      setCourse(data);
      toast("Lesson added");
    } catch (error) {
      console.log(error);
      toast("Lesson add failed");
    }
  };

  const handleVideoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/course/upload-video/${course.instructor._id}`,

        videoData,
        {
          "Content-Type": "multipart/form-data",
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      // once response is received, set video in the state
      console.log("data", data);
      setValues({ ...values, video: data });
      setUploading(false);
      toast("Video upload success");
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Video upload failed");
    }
  };

  const handleVideoRemove = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/course/remove-video/${course.instructor._id}}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploadButtonText("Upload another Video");
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Video remove failed");
    }
  };

  const handlePublish = async (e) => {
    let answer = window.confirm(
      "Once you publish your course, it will be live in the marketplace for students to enroll. Are you sure you want to publish this course?"
    );
    if (!answer) return;
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/course/publish/${course._id}`
      );
      setCourse(data);
      toast("Congrats! Your course is now live in the marketplace");
    } catch (error) {
      toast("Course publish failed. Try again");
    }
  };
  const handleUnpublish = async (e) => {
    let answer = window.confirm(
      "Once you unpublish your course, it will no longer be available for students to enroll. Are you sure you want to unpublish this course?"
    );
    if (!answer) return;
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/course/unpublish/${course._id}`
      );
      setCourse(data);
      toast("Your course is now unpublished");
    } catch (error) {
      toast("Course unpublish failed. Try again");
    }
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
                    <EditOutlined
                      onClick={() =>
                        router.push(`/instructor/course/edit/${slug}`)
                      }
                      className="h5 pointer text-warning mr-4"
                    />
                  </Tooltip>
                  {course.lessons && course.lessons.length < 5 ? (
                    <Tooltip title="Min 5 lessons required to publish">
                      <QuestionOutlined
                        className="h5 pointer text-danger"
                        disabled
                      />
                    </Tooltip>
                  ) : course.published ? (
                    <Tooltip title="Unpublish">
                      <CloseOutlined
                        onClick={handleUnpublish}
                        className="h5 pointer text-danger"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Publish">
                      <CheckOutlined
                        onClick={handlePublish}
                        className="h5 pointer text-success"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />
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

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></List.Item.Meta>
                    </List.Item>
                  )}
                ></List>
              </div>
            </div>

            <Modal
              title="+ Add Lesson"
              centered
              open={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideoUpload={handleVideoUpload}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>
          </div>
        </div>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
