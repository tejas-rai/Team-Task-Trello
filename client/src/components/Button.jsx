export default function Button({ children, className = "", ...props }) {
    return (
      <button
        className={`bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-secondary transition focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  