import axios from "../../../../axios/axios";
import InstructorRoute from "../../../../routes/InstructorRoute";
import { useState, useEffect } from "react";
import { Select, Button } from "antd";
import CreateCourseForm from "../../../../components/forms/CreateCourseForm";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;
const { Option } = Select;

const EditCourse = () => {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [values, setValues] = useState({
    title: "",
    name: "",
    description: "",
    price: "",
    uploading: false,
    paid: false,
    loading: false,
    category: "",
    image: "",
    loading: false,
    lessons: [],
  });

  const [preview, setPreview] = useState("");

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
      loadCourse();
    }
  }, [router.query.slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${router.query.slug}`
    );
    data.name = data.title;
    setValues(data);
    setPreview(data.image ? data.image.Location : "");
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    console.log("upload image", e.target.files[0]);
    setPreview(window.URL.createObjectURL(e.target.files[0]));
    setValues({
      ...values,
      loading: true,
    });
    console.log("values", values);
    try {
      console.log("values", e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = async () => {
        let { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/course/upload-image`,

          { image: reader.result },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setValues({ ...values, loading: false, image: data });
      };
      reader.readAsDataURL(e.target.files[0]);
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}`,
        {
          ...values,
          title: values.name,
        }
      );
      console.log(data);
      setValues({ ...values, loading: false });
      router.push("/instructor");
      toast.success("Course created");
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast.error("Course create failed. Try again.");
    }
  };

  const handleDrag = (e, index) => {
    console.log("ON DRAG => ", index);
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    console.log("ON DROP => ", index);

    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    const allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // lesson to be moved
    allLessons.splice(movingItemIndex, 1); // remove lesson from old position
    allLessons.splice(targetItemIndex, 0, movingItem); // insert lesson to new position
    setValues({ ...values, lessons: [...allLessons] });

    // save the new lessons order in db
    const { data } = axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}`,
      {
        ...values,
        title: values.name,
      }
    );

    console.log("LESSONS REARRANGED RES => ", data);
    toast("Lessons rearranged successfully");
  };

  const handleDelete = async (index, item) => {
    console.log("handle delete => ", item);
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;
    const allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    // send request to server
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}/${removed[0]._id}`
    );
    console.log("LESSON DELETE RES => ", data);
    toast("Lesson deleted");
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();

    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/course/lesson/${slug}/${current._id}`,
      current
    );
    console.log("LESSON UPDATED RES => ", data);
    setUploadVideoButtonText("Upload Video");

    setVisible(false);
    setValues(data);
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast("Lesson updated");
    }
  };

  const handleVideoUpload = async (e) => {
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/course/remove-video/${values.instructor._id}`,
        current.video
      );
      console.log("VIDEO REMOVE RES => ", res);
    }
    // upload video
    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);

    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/course/upload-video/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };
  const handleVideoRemove = async (e) => {};

  console.log("values lessons", values);
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square"> Edit Course</h1>

      <div className="pt-3 pb-3">
        <CreateCourseForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          preview={preview}
          setValues={setValues}
          editPage={true}
        />
      </div>

      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index, item)}
                  className="text-danger float-end"
                />
              </List.Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title="Update lesson"
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          values={current}
          setValues={setCurrent}
          handleUpdateLesson={handleUpdateLesson}
          uploading={uploading}
          uploadButtonText={uploadVideoButtonText}
          handleVideoUpload={handleVideoUpload}
          progress={progress}
          handleVideoRemove={handleVideoRemove}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default EditCourse;
