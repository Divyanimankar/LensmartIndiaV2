import "./loading.css";

export default function Loading() {
  return (
    <div
      className="lens-loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="lens-loader-content">
        <div className="lens-loader-logo">
          <img
            src="/logo1.png"
            alt="LensMartIndia"
            className="lens-loader-icon"
            width="572"
            height="134"
            decoding="async"
            fetchPriority="high"
            draggable="false"
          />
        </div>

        <div className="lens-loader-spinner" />

        <div className="lens-loader-progress">
          <span />
        </div>
      </div>
    </div>
  );
}
