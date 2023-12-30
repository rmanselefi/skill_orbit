import { useEffect, useState, useContext } from "react";

import { Context } from "../context";
import axios from "../axios/axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import InstructorNav from "../components/nav/InstructorNav";


const InstructorRoute = ({ children }) => {
  const [ok, setOk] = useState(true);
  const router = useRouter();
  const {
    state: { user },
  } = useContext(Context);
  useEffect(() => {
    const loadInstructor = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/current-instructor"
        );
        if (data.ok) setOk(true);
      } catch (err) {
        console.log(err);
        setOk(false);
        router.push("/login");
      }
    };

    loadInstructor();
  }, []);

  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary"
        />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <InstructorNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default InstructorRoute;
