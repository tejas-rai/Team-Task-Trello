export function Input({ className = "", ...props }) {
    return (
      <input
        className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
    );
  }
  
  export function Select({ className = "", children, ...props }) {
    return (
      <select
        className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
  