'use client';

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-outline" onClick={() => window.print()}>
      🖨️ Imprimir
    </button>
  );
}
