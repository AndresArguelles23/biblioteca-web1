export default function Loading() {
  return (
    <>
      <div className="dash-intro">
        <div className="skeleton-line" style={{ width: 90, height: 12, marginBottom: 10 }} />
        <div className="skeleton-line" style={{ width: 280, height: 30, marginBottom: 10 }} />
        <div className="skeleton-line" style={{ width: 360, height: 14 }} />
      </div>
      <div className="stats-row">
        {[1, 2, 3, 4].map((i) => (
          <div className="stat-card skeleton-card" key={i}>
            <div className="skeleton-line" style={{ width: '50%', height: 28, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: '75%', height: 12 }} />
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <div className="panel panel-span-5">
          <div className="skeleton-line" style={{ width: 150, height: 16, marginBottom: 16 }} />
          <div className="skeleton-block" style={{ height: 200 }} />
        </div>
        <div className="panel panel-span-7">
          <div className="skeleton-line" style={{ width: 180, height: 16, marginBottom: 16 }} />
          <div className="skeleton-block" style={{ height: 200 }} />
        </div>
        <div className="panel panel-span-12">
          <div className="skeleton-line" style={{ width: 200, height: 16, marginBottom: 16 }} />
          <div className="skeleton-block" style={{ height: 180 }} />
        </div>
      </div>
    </>
  );
}
