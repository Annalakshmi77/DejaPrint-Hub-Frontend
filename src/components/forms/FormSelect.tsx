import { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, required, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg transition
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            disabled:bg-gray-100 disabled:text-gray-600
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-600">{hint}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
