export default function Loading() {
  return (
    <div className="form-card">
      <div className="skeleton-line" style={{ width: 200, height: 20, marginBottom: 20 }} />
      <div className="form-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton-line" style={{ width: '40%', height: 12, marginBottom: 6 }} />
            <div className="skeleton-line" style={{ width: '100%', height: 38 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
