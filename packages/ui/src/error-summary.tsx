'use client';
import { useEffect, useRef } from 'react';
export type FieldError = { id: string; message: string };
export function ErrorSummary({
  errors,
  title,
  focusKey = 0,
}: {
  errors: FieldError[];
  title: string;
  focusKey?: number;
}) {
  const summary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusKey > 0) summary.current?.focus();
  }, [focusKey]);
  if (!errors.length) return null;
  return (
    <div className="av-error-summary" ref={summary} tabIndex={-1} role="alert">
      <h3>{title}</h3>
      <ul>
        {errors.map(({ id, message }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(id)?.focus();
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
