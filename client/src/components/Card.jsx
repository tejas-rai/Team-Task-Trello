export default function Card({ children, className = "" }) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition ${className}`}>
        {children}
      </div>
    );
  }
  