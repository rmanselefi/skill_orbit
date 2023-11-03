import { Menu, Dropdown, Space, Button } from "antd";
import Link from "next/link";
import axios from "axios";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutFilled,
  TeamOutlined,
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

  const items = [
    {
      key: "1",
      label: (
        <Item className="float-right">
          <Link href="/user">
            <span>Profile</span>
          </Link>
        </Item>
      ),
    },
    {
      key: "2",
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
  ];

  return (
    <Menu mode="horizontal">
      <Item icon={<AppstoreOutlined />}>
        <Link href="/">
          <span>App</span>
        </Link>
      </Item>

      {user && user.role && user.role.includes("Instructor") ? (
        <Item icon={<CarryOutFilled />}>
          <Link href="/instructor/course/create">
            <span>Create Course</span>
          </Link>
        </Item>
      ) : (
        <Item icon={<TeamOutlined />}>
          <Link href="/user/become-instructor">
            <span>Become Instructor</span>
          </Link>
        </Item>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item icon={<TeamOutlined />}
        className="float-end">
          <Link href="/instructor">
            <span>Instructor</span>
          </Link>
        </Item>
      )}
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
        <div className="float-end" >
        <Space direction="vertical">
          <Space wrap>
            <Dropdown menu={{ items }}>
              <Button>
                {user.name} <CoffeeOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Space>
        </div>
      )}
    </Menu>
  );
};

export default TopNav;
