'use client';

export default function DeleteButton({ action, titulo }) {
  const texto = titulo && titulo.length > 80 ? titulo.slice(0, 80) + '…' : titulo;
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const ok = window.confirm(
          `¿Eliminar "${texto || 'este libro'}" del inventario? Esta acción no se puede deshacer.`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <button type="submit" className="btn btn-danger">
        Eliminar este libro
      </button>
    </form>
  );
}
