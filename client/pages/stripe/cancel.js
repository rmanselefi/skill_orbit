import { CloudSyncOutlined } from "@ant-design/icons";

import UserRoute from "../../routes/UserRoutes";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false} >
      <div className="container text-center">
        <div className="col-md-6 offset-md-3">
          <CloudSyncOutlined className="display-1 text-danger p-5" />
          <p className="lead">Payment failed. Try again.</p>
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
