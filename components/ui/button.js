export function Button({ children, ...props }) {
    return (
      <button
        {...props}
        style={{
          backgroundColor: "#F97316",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {children}
      </button>
    );
  }
  