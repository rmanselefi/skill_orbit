import { Card, Badge } from "antd";
import Link from "next/link";

const { Meta } = Card;

const CourseCard = ({ course }) => {
    console.log("course", course);
  return (
    <Link href={`/course/${course.slug}`}>
      <Card
        className="mb-4"
        cover={
          <img
            src={course.image.Location}
            alt={course.title}
            style={{ height: "200px", objectFit: "cover" }}
            className="p-1"
          />
        }
      >
        <h2 className="font-weight-bold">{course.title}</h2>
        <p>{course.description}</p>
        <Badge
          count={course.lessons.length}
          style={{ backgroundColor: "#03a9f4" }}
          className="pb-4 mr-2"
        />
        <h4 className="pt-2"> {course.paid ? course.price : "Free"} </h4>
      </Card>
    </Link>
  );
};

export default CourseCard;
