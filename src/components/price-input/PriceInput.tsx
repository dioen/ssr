import { useState, useEffect, ChangeEvent, useRef } from 'react';

export interface PriceInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  debounce?: number;
}

export function PriceInput({
  value,
  onChange,
  placeholder,
  className = '',
  debounce = 300,
}: PriceInputProps) {
  const [display, setDisplay] = useState<string>(
    value === null ? '' : String(value)
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplay(value === null ? '' : String(value));
  }, [value]);

  const emitChange = (val: string) => {
    if (val === '') {
      onChange(null);
      return;
    }

    const currentNumber = Number(val);
    if (!isNaN(currentNumber)) {
      onChange(currentNumber);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplay(val);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => emitChange(val), debounce);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const targetValue = e.target.value;

    if (targetValue === '') {
      onChange(null);
      return;
    }

    if (isNaN(Number(targetValue))) {
      setDisplay(value === null ? '' : String(value));
      return;
    }

    onChange(value);
  };

  return (
    <input
      type="number"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
    />
  );
}
