import "../styles/toast.css";

export default function Toast({ msg, type }) {
  return (
    <div className={`toast toast-${type || "success"}`}>
      {type === "error" ? "⚠ " : "✓ "}
      {msg}
    </div>
  );
}
