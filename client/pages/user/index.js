import { useEffect, useState, useContext } from "react";

import { Context } from "../../context";
import UserRoute from "../../routes/UserRoutes";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <div>
        <h1 className="jumbotron text-center bg-primary square">
          User Dashboard
        </h1>
      </div>
    </UserRoute>
  );
};
export default UserIndex;
