import { Avatar, List } from "antd";
const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  setPreview,
  showModal,
  setShowModal,
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col lesson-list">
          <h4>{lessons.length} Lessons</h4>
          <hr />
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={(item, index) => {
              console.log("item===>", item);
              return (
                <Item>
                  <Item.Meta
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={item.title}
                  ></Item.Meta>
                  {item.video && item.video.Location && (
                    <span
                      onClick={() => {
                        setPreview(item.video.Location);
                        setShowModal(!showModal);
                      }}
                      className="text-primary pointer"
                    >
                      Preview
                    </span>
                  )}
                </Item>
              );
            }}
          ></List>
        </div>
      </div>
    </div>
  );
};
export default SingleCourseLessons;
