import React from "react";
import { Button, Progress, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";

function AddLessonForm(props) {
  const {
    values,
    setValues,
    handleAddLesson,
    uploading,
    uploadButtonText,
    handleVideoUpload,
    progress,
    handleVideoRemove,
  } = props;
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3 mb-3"
          cols="7"
          rows="7"
          placeholder="Description"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadButtonText}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
            />
          </label>

          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span
                onClick={() => setValues({ ...values, video: {} })}
                className="pt-1 pl-3"
              >
                <CloseOutlined
                  className="text-danger d-flex justify-content-center pt-3"
                  onClick={handleVideoRemove}
                />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            value={progress}
            max="100"
          />
        )}
        <div className="d-grid gap-2">
          <Button
            className="col mt-3"
            type="primary"
            size="large"
            shape="round"
            onClick={handleAddLesson}
            loading={uploading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddLessonForm;
