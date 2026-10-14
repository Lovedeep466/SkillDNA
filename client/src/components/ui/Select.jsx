import { fieldClass } from "./styles";

export default function Select({ label, id, className = "", children, ...props }) {
  const selectId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-medium text-muted">
          {label}
        </label>
      )}
      <select id={selectId} className={`${fieldClass} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
