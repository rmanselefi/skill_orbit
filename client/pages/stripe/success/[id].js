import { useEffect } from "react";

import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../routes/UserRoutes";
import axios from "../../../axios/axios";
import { useRouter } from "next/router";

const StripeSuccess = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) successEnrollment();
  }, [id]);

  const successEnrollment = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe-success/${id}`
      );
      console.log(data);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute showNav={false}>
      <div className="row text-center">
        <div className="col-md-9 pb-5">
          <div className="d-flex justify-content-center">
            <SyncOutlined className="display-1 text-success p-5" />
            <h1>Payment Successful. Redirecting...</h1>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};
export default StripeSuccess;
