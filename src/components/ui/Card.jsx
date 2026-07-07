export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-bg-elevated shadow-card ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
