import { useEffect, useState, useContext } from "react";

import { Context } from "../../context";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const UserRoute = ({ children }) => {
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
        console.log(data);
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
        <>{children}</>
      )}
    </>
  );
};
export default UserRoute;
