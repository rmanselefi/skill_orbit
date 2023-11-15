import axios from "../../../axios/axios";
import InstructorRoute from "../../../routes/InstructorRoute";
import { useState, useEffect } from "react";
import { Select, Button } from "antd";
import CreateCourseForm from "../../../components/forms/CreateCourseForm";
import { useRouter } from "next/router";

const { Option } = Select;

const CreateCourse = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    uploading: false,
    paid: false,
    loading: false,
    category: "",
    imagePreview: "",
    success: "",
    error: "",
    preview: "",
    formData: "",
    buttonText: "Submit",
    image: "",
    loading: false,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    console.log("upload image", e.target.files[0]);
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0]),
      buttonText: "Upload Image",
      imageUploadText: e.target.files[0].name,
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
        setValues({ ...values, image: data });
      };
      reader.readAsDataURL(e.target.files[0]);

      console.log(data);
      setValues({ ...values, loading: false, image: data });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/course`, {
        ...values,
        image: values.image,
      });
      console.log(data);
      setValues({ ...values, loading: false, success: "Course is created" });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false, error: err.response.data });
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square"> Create Course</h1>

      <div className="pt-3 pb-3">
        <CreateCourseForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
        />
      </div>
    </InstructorRoute>
  );
};

export default CreateCourse;
