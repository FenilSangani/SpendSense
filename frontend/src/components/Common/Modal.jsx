// Modal.jsx — Reusable modal (popup) component
// Used for forms like "Add Transaction" or "Edit Transaction"
// Shows a dark overlay behind the modal content

const Modal = ({ isOpen, onClose, title, children }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Close the modal when clicking the dark overlay (not the content)
  const handleOverlayClick = (e) => {
    // e.target is what was clicked, e.currentTarget is the overlay div
    // Only close if user clicked directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Modal title */}
        <h2>{title}</h2>

        {/* Modal body — whatever is passed as children */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
