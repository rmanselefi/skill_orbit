import axios from "../../axios/axios";

import { useContext, useState } from "react";

import { Context } from "../../context";
import { Button } from "antd";

import { toast } from "react-toastify";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import UserRoute from "../../routes/UserRoutes";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/make-instructor");
      console.log(data);
      window.location.href = data;
    } catch (err) {
      console.log(err);
      toast("Stripe onboarding failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="jumbotron text-center square">Become Instructor</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Edemy</h2>
              <p className="lead text-warning">
                Edemy partners with stripe to transfer earnings to your bank
                account
              </p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
                onClick={handleClick}
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>

              <p className="lead">
                {" "}
                You will be redirected to stripe ro complete the onboarding
                process
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeInstructor;
