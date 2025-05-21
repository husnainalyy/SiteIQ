export function Card({ children, className }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6 ${className || ''}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={`mb-4 ${className || ''}`}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={`text-xl font-semibold ${className || ''}`}>{children}</h3>
}

export function CardDescription({ children, className }) {
  return <p className={`text-gray-500 dark:text-gray-400 ${className || ''}`}>{children}</p>
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>
}
