import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserRoute from "../../../routes/UserRoutes";
import axios from "../../../axios/axios";

const SingleCourse = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState({
    lessons: [],
  });
  const [loading, setLoading] = useState(false);

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
    <UserRoute>
      <h1 className="jumbotron text-center square"></h1>
      {course.title}
      <pre>{JSON.stringify(course, null, 4)}</pre>
    </UserRoute>
  );
};

export default SingleCourse;
