import { Menu } from "antd";
import Link from "next/link";

const { Item } = Menu;

const TopNav = () => {
  return (
    <Menu>
      <Item>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Item>
    </Menu>
  );
};

export default TopNav;
