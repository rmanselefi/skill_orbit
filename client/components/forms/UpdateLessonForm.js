import React from "react";
import { Button, Progress, Switch, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

function UpdateLessonForm(props) {
  const {
    values,
    setValues,
    handleUpdateLesson,
    uploading,
    uploadButtonText,
    handleVideoUpload,
    progress,
    handleVideoRemove,
  } = props;
  return (
    <div className="container pt-3">
      <form onSubmit={handleUpdateLesson}>
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

        <div>
          {!uploading && values?.video?.Location && (
            <div>
              <ReactPlayer
                url={values?.video?.Location}
                width="410px"
                height="240px"
                className="mt-3"
                controls
              />
            </div>
          )}
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadButtonText}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
            />
          </label>
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            value={progress}
            max="100"
          />
        )}

        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
          <Switch
            className="float-end mt-3"
            disabled={uploading}
            checked={values.free_preview}
            name="free_preview"
            onChange={(v) => setValues({ ...values, free_preview: v })}
          />
        </div>

        <div className="d-grid gap-2">
          <Button
            className="col mt-3"
            type="primary"
            size="large"
            shape="round"
            onClick={handleUpdateLesson}
            loading={uploading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateLessonForm;
