import { useState, useEffect } from "react";
import { Select, Button, Avatar } from "antd";
const { Option } = Select;

const CreateCourseForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  setValues,
  values,
  preview
}) => {
  const children = [];
  for (let i = 9.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group m-2">
        <input
          type="text"
          name="name"
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          value={values.name}
        />
      </div>
      <div className="form-group m-2">
        <textarea
          name="description"
          onChange={handleChange}
          className="form-control"
          placeholder="Description"
          value={values.description}
          cols="7"
        />
      </div>
      <div className="row">
        <div className="form-group col-8">
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(v) => setValues({ ...values, paid: v, price: "" })}
          >
            <Option value={true}>Paid</Option>
            <Option value={false}>Free</Option>
          </Select>
        </div>

        {values.paid && (
          <div className="form-group col-4">
            <Select
              defaultValue="$9.99"
              style={{ width: "100%" }}
              onChange={(v) => setValues({ ...values, price: v })}
              tokenSeparators={[,]}
              size="large"
            >
              {children}
            </Select>
          </div>
        )}
        <div className="form-group m-2">
          <input
            type="text"
            name="category"
            onChange={handleChange}
            className="form-control"
            placeholder="Category"
            value={values.category}
          />
        </div>
        <div
          className="form-group"
          style={{
            width: "100%",
          }}
        >
          <label className="btn btn-outline-secondary btn-block m-2 text-left">
            Image
            <input
              type="file"
              name="image"
              onChange={handleImage}
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>
      {preview && (
        <div className="col-md-6">
          <Avatar width={200} src={preview} />
        </div>
      )}
      <div className="row">
        <div className="col">
          <div className="form-group">
            <Button
              onClick={handleSubmit}
              disabled={values.loading || values.uploading}
              className="btn btn-primary"
              loading={values.loading}
              type="primary"
              size="large"
              shape="round"
            >
              {values.loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateCourseForm;
