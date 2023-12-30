import React, { useState, useEffect, useContext, use } from "react";

import { useRouter } from "next/router";
import { Badge, Button } from "antd";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

import axios from "../../axios/axios";
import PreviewModal from "../../components/modal/PreviewModal";
import ReactPlayer from "react-player";
import { Context } from "../../context";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const SingleCourse = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [enrolled, setEnrolled] = useState({});

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [course.lessons]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/course/check-enrollment/${course._id}`
    );
    console.log("CHECK ENROLLMENT => ", data);
    setEnrolled(data);
  };

  const loadCourse = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/course/${slug}`
    );
    setCourse(data);
  };

  const handlePaidEnrollment = async () => {
    try {
      setLoading(true);
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paid-enrollment`,
        {
          courseId: course._id,
        }
      );
      console.log("PAID ENROLLMENT => ", data);

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      stripe.redirectToCheckout({
        sessionId: data.id,
      });
      setLoading(false);
      // router.push(`/user/course/${slug}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async () => {
    e.preventDefault();

    try {
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/free-enrollment`,
        {
          courseId: course._id,
        }
      );
      toast("Enrolled! Check your dashboard");
      setLoading(false);

      router.push(`/user/course/${data.course.slug}`);
    } catch (error) {
      console.log(error);
      toast("Enrollment failed. Try again");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid pt-3">
        <div
          className="jumbotron bg-primary square"
          style={{
            height: "300px",
          }}
        >
          <div className="row">
            <div className="col-md-8">
              <h1 className="text-light font-weight-bold">{course.title}</h1>
              <p className="lead text-light">{course.description}</p>
              <Badge
                count={course.category}
                style={{ backgroundColor: "#03a9f4" }}
                className="pb-4 mr-2"
              />
              <p className="text-light">
                Created by {course.instructor && course.instructor.name}
              </p>
              <p className="text-light">
                Last Updated {new Date(course.updatedAt).toLocaleDateString()}
              </p>
              <h4 className="text-light">
                {" "}
                {course.paid ? course.price : "Free"}{" "}
              </h4>
            </div>
            <div className="col-md-4">
              {course.lessons &&
              course.lessons[0].video &&
              course.lessons[0].video.Location ? (
                <div
                  onClick={() => {
                    setPreview(course.lessons[0].video.Location);
                    setShowModal(!showModal);
                  }}
                >
                  <ReactPlayer
                    url={course.lessons[0].video.Location}
                    light={course.image.Location}
                    playing={showModal}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
                </div>
              ) : (
                <div>
                  <img
                    src={course.image ? course.image.Location : "/course.png"}
                    alt={course.name}
                    className="img img-fluid"
                  />
                  <div className="text-center">
                    <i className="far fa-play-circle fa-4x text-light"></i>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="d-flex justify-content-center">
                  <LoadingOutlined className="h1 text-danger p-5" />
                </div>
              ) : (
                <Button
                  className="mb-3 mt-3 bg-danger"
                  type="primary"
                  block
                  shape="round"
                  icon={<SafetyOutlined />}
                  size="large"
                  disabled={course.lessons && course.lessons.length < 5}
                  onClick={
                    course.paid ? handlePaidEnrollment : handleFreeEnrollment
                  }
                >
                  {user
                    ? enrolled.status
                      ? "Go to course"
                      : "Enroll"
                    : "Login to Enroll"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      {course.lessons && course.lessons.length && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default SingleCourse;
