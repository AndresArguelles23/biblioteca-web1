export default function Loading() {
  return (
    <>
      <div className="filters">
        <div className="skeleton-line" style={{ width: '100%', height: 38, flex: '1 1 220px' }} />
        <div className="skeleton-line" style={{ width: 160, height: 38 }} />
        <div className="skeleton-line" style={{ width: 140, height: 38 }} />
      </div>
      <div className="book-table-wrap" style={{ padding: 16 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: '100%', height: 44, marginBottom: 8 }} />
        ))}
      </div>
    </>
  );
}
