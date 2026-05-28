import "./Loader.css";

export default function Loader({ show }) {
  if (!show) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="loader-ring"></div>
        <p className="loader-text">Loading</p>
      </div>
    </div>
  );
}
