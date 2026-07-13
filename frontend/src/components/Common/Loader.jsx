// Loader.jsx — Loading spinner component
// Shows a spinning circle while data is being fetched

const Loader = () => {
  return (
    <div className="loader-container">
      {/* The CSS animation for .spinner is in App.css */}
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
