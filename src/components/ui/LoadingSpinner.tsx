interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function LoadingSpinner({ size = 'lg', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
  }

  return (
    <div className={`flex min-h-screen items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      />
    </div>
  )
}

export default LoadingSpinner
