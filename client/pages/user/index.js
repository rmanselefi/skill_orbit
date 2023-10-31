import { useEffect, useState, useContext } from "react";

import { Context } from "../../context";
import axios from "axios";

const UserIndex = () => {
  const [hidden, setHidden] = useState(true);
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
        setHidden(false);
      } catch (err) {
        console.log(err);
        setHidden(true);
      }
    };
    loadUsers();
  }, []);

  return hidden && (
    <div>
      <h1>User Index</h1>
    </div>
  );
};
export default UserIndex;
