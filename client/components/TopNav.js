import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

const { Item } = Menu;

const TopNav = () => {
  return (
    <Menu mode="horizontal" >
      <Item icon={<AppstoreOutlined/>} >
        <Link href="/">
          <span>App</span>
        </Link>
      </Item>
      <Item>
        <Link href="/login">
          <span>Login</span>
        </Link>
      </Item>
      <Item>
        <Link href="/register">
          <span>Register</span>
        </Link>
      </Item>
    </Menu>
  );
};

export default TopNav;
