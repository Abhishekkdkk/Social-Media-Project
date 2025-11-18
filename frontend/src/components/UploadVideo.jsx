import "../components/UploadVideo.css";
import { uploadVideo } from "../services/UploadServices";
import { useState } from "react";
function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({});
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);
    const file = e.dataTransfer.files[0];
    console.log(file);
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setVideoFile(file);
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("videourl", videoFile);
      formData.append("thumbnail", thumbnailFile);
      formData.append("title", title);
      formData.append("description", description);
      const response = await uploadVideo(formData);
      if (!response) {
        throw new Error("Failed to upload");
      }
      alert("Upload successful");
      setVideoFile(null);
      setVideoPreview(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="uploadvideo-container">
      <div className="header">
        <h1>Upload Video</h1>
        <h2>Share your content with the world</h2>
      </div>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-grid">
          <div className="upload-section">
            <label className="text-label">Video File</label>
            <div
              className={`upload-dropzone ${
                isDraggingVideo ? "dragging" : ""
              } ${videoPreview ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingVideo(true);
              }}
              onDragLeave={() => setIsDraggingVideo(false)}
              onDrop={handleVideoDrop}
            >
              {videoPreview ? (
                <div className="preview-container">
                  <video
                    src={videoPreview}
                    controls
                    className="video-preview"
                  ></video>
                  <button
                    className="remove-button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                  >
                    Remove Video
                  </button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="upload-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="dropzone-text">Drag and drop video file here</p>
                  <p className="dropzone-subtext">or</p>
                  <label className="file-input-label">
                    Select File
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="file-input"
                    />
                  </label>
                  <p className="file-info">MP4, WebM, or AVI (Max 2GB)</p>
                </div>
              )}
            </div>
          </div>
          <div className="upload-section">
            <label className="text-label">Thumbnail</label>
            <div
              className={`upload-dropzone ${
                isDraggingThumbnail ? "dragging" : ""
              } ${thumbnailPreview ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingThumbnail(true);
              }}
              onDragLeave={() => setIsDraggingThumbnail(false)}
              onDrop={handleThumbnailDrop}
            >
              {thumbnailPreview ? (
                <div className="preview-container">
                  <img
                    src={thumbnailPreview}
                    className="thumbnail-preview"
                  ></img>
                  <button
                    className="remove-button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    Remove Thumbnail
                  </button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="upload-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="dropzone-text">Upload thumbnail</p>
                  <label className="file-input-label">
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="file-input"
                    />
                  </label>
                  <p className="file-info">JPG or PNG (1280x720 recommended)</p>
                </div>
              )}
            </div>
          </div>
          <div className="details-section">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your video"
                className="form-input"
                maxLength={100}
                required
              />
              <span className="character-count">{title.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video"
                className="form-textarea"
                maxLength={5000}
                rows={6}
              />
              <span className="character-count">{description.length}/5000</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className=" button-primary loading-button"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : "Publish"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default UploadVideo;
