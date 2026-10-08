export default function Loading() {
  return (
    <>
      <div className="skeleton-line" style={{ width: 160, height: 14, marginBottom: 20 }} />
      <div className="skeleton-line" style={{ width: 90, height: 22, marginBottom: 12 }} />
      <div className="skeleton-line" style={{ width: '60%', height: 30, marginBottom: 10 }} />
      <div className="skeleton-line" style={{ width: '30%', height: 16, marginBottom: 26 }} />
      <div className="panel">
        <div className="skeleton-line" style={{ width: 180, height: 16, marginBottom: 18 }} />
        <div className="skeleton-block" style={{ height: 180 }} />
      </div>
    </>
  );
}
