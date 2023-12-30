import { useEffect, useState, useContext } from "react";

import { Context } from "../context";
import axios from "../axios/axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import UserNav from "../components/nav/UserNav";

const UserRoute = ({ children, showNav = true }) => {
  const [ok, setOk] = useState(true);
  const router = useRouter();
  const {
    state: { user },
  } = useContext(Context);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/current-user"
        );
        if (data.ok) setOk(true);
      } catch (err) {
        console.log(err);
        setOk(false);
        router.push("/login");
      }
    };

    loadUsers();
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
            {showNav && (
              <div className="col-md-2">
                <UserNav />
              </div>
            )}
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default UserRoute;
