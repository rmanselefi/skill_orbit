import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // this is for the loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.table({ name, email, password });

      const { data } = await axios.post(`http://localhost:8000/api/login`, {
        email,
        password,
      });
      console.log("LOGIN RESPONSE", data);
      // toast.success("Registration successful. Please login.");
      setLoading(false);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <br />
          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={ !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center p-3">
          Not yet registered? Register
          <Link href="/register">
            here
          </Link>
        </p>
      </div>
    </>
  );
};
export default Login;
