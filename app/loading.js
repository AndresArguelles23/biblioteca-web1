export default function Loading() {
  return (
    <>
      <div className="stats-row">
        {[1, 2, 3, 4].map((i) => (
          <div className="stat-card skeleton-card" key={i}>
            <div className="skeleton-line" style={{ width: '50%', height: 28, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: '75%', height: 12 }} />
          </div>
        ))}
      </div>
      <div className="dash-stack">
        {[1, 2, 3, 4].map((i) => (
          <div className="panel" key={i}>
            <div className="skeleton-line" style={{ width: 180, height: 16, marginBottom: 16 }} />
            <div className="skeleton-block" style={{ height: 200 }} />
          </div>
        ))}
      </div>
    </>
  );
}
