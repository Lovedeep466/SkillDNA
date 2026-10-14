import { fieldClass } from "./styles";

export default function Input({ label, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <input id={inputId} className={`${fieldClass} ${className}`} {...props} />
    </div>
  );
}
