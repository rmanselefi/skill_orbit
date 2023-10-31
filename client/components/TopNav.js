import { Menu } from "antd";
import Link from "next/link";
import axios from "axios";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Context } from "../context";
import { useContext } from "react";

const { Item } = Menu;

const TopNav = () => {
  const { state, dispatch } = useContext(Context);

  const { user } = state;
  const router = useRouter();

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };
  return (
    <Menu mode="horizontal">
      <Item icon={<AppstoreOutlined />}>
        <Link href="/">
          <span>App</span>
        </Link>
      </Item>
      {
        user === null && (
          <>
            <Item icon={<LoginOutlined />}>
              <Link href="/login">
                <span>Login</span>
              </Link>
            </Item>
            <Item icon={<UserAddOutlined />}>
              <Link href="/register">
                <span>Register</span>
              </Link>
            </Item>
          </>
        )
        // if user is not null, then we know that the user is logged in
      }
      {user !== null && (
        <Item
          onClick={logout}
          icon={<LogoutOutlined />}
          className="float-right"
        >
          <span>Logout</span>
        </Item>
      )}
    </Menu>
  );
};

export default TopNav;
