export default function Loading() {
  return (
    <>
      <div className="dash-intro">
        <div className="skeleton-line" style={{ width: 90, height: 12, marginBottom: 10 }} />
        <div className="skeleton-line" style={{ width: 260, height: 30, marginBottom: 10 }} />
        <div className="skeleton-line" style={{ width: 340, height: 14 }} />
      </div>
      <div className="filters">
        <div className="skeleton-line" style={{ width: '100%', height: 38, flex: '1 1 260px' }} />
        <div className="skeleton-line" style={{ width: 160, height: 38 }} />
      </div>
      <div className="book-table-wrap" style={{ padding: 16 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: '100%', height: 44, marginBottom: 8 }} />
        ))}
      </div>
    </>
  );
}
