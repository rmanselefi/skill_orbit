import axios from "../../../axios/axios";
import InstructorRoute from "../../../routes/InstructorRoute";
import { useState, useEffect } from "react";
import { Select, Button } from "antd";
import CreateCourseForm from "../../../components/forms/CreateCourseForm";
import { useRouter } from "next/router";
import { toast } from "react-toastify";


const { Option } = Select;

const CreateCourse = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    title:"",
    name: "",
    description: "",
    price: "",
    uploading: false,
    paid: false,
    loading: false,
    category: "",
    image: "",
    loading: false,
  });

  const [preview, setPreview] = useState("");

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
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
        ...values,
        title: values.name,
      });
      console.log(data);
      setValues({ ...values, loading: false});
      router.push("/instructor"); 
      toast.success("Course created");
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast.error("Course create failed. Try again.");
      
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
          preview={preview}
          setValues={setValues}
        />
      </div>
    </InstructorRoute>
  );
};

export default CreateCourse;
