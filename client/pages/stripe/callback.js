import { useContext, useEffect } from "react";

import { Context } from "../../context/index";
import axios from "../../axios/axios";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../routes/UserRoutes";

const StripeCallBack = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios
        .post("/api/get-account-status")
        .then((res) => {
          dispatch({
            type: "LOGIN",
            payload: res.data,
          });
          window.localStorage.setItem("user", JSON.stringify(res.data));
          window.location.href = "/instructor";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);
  return (
    <UserRoute>
      <SyncOutlined
        spin
        className="d-flex justify-content-center display-1 text-danger p-5"
      />
    </UserRoute>
  );
};

export default StripeCallBack;
