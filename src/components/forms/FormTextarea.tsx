import { TextareaHTMLAttributes, forwardRef } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg transition resize-vertical
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            disabled:bg-gray-100 disabled:text-gray-600
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-600">{hint}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
