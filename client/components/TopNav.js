import { Menu, Dropdown, Space, Button } from "antd";
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
  const menu = (
    <Menu>
      <Item key="2">Profile</Item>
    </Menu>
  );
  const items = [
    {
      key: "1",
      label: (
        <Item
          onClick={logout}
          icon={<LogoutOutlined />}
          className="float-right"
        >
          <span>Logout</span>
        </Item>
      ),
    },
    {
      key: "2",
      label: (
        <Item className="float-right">
          <Link href="/user/profile">
            <span>Profile</span>
          </Link>
        </Item>
      ),
    },
  ];

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
        <Space direction="vertical">
          <Space wrap>
            <Dropdown menu={{ items }}>
              <Button>
                {user.name} <CoffeeOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Space>
      )}
    </Menu>
  );
};

export default TopNav;
