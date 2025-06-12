import React from "react";

function Modal({ open, title, children, onClose, hideCloseButton }) {
  if (!open) return null;
  // Detectar si el hijo es un formulario de edición (Users.jsx)
  const isEditForm = React.Children.toArray(children).some(
    (child) =>
      child &&
      typeof child.type === "string" &&
      child.type === "form" &&
      child.props?.onSubmit
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {title && (
          <h3 className="text-xl font-bold mb-4 text-black">{title}</h3>
        )}
        <div className="mb-4">{children}</div>
        {/* Solo mostrar botón cerrar si no es un formulario de edición */}
        {!hideCloseButton && !isEditForm && (
          <button
            className="w-full bg-[#68df9f] text-white p-2 rounded-md hover:bg-[#56df9e] font-semibold shadow-md transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal;
