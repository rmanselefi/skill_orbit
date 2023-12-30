import Link from "next/link";

const InstructorNav = () => {
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/instructor">
        <span className="nav-link active">Dashboard</span>
      </Link>
      <Link href="/instructor/course/create">
        <span className="nav-link">Create Course</span>
      </Link>
    </div>
  );
};

export default InstructorNav;
