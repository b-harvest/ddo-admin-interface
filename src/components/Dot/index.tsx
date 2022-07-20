export default function Dot({ color, size = 'sm' }: { color?: string; size?: string }) {
  return (
    <div
      className={`${getSizeClass(size)} rounded-full`}
      style={{ background: color, boxShadow: `0 3px 6px -1px ${color}` }}
    ></div>
  )
}

function getSizeClass(size?: string) {
  switch (size) {
    case 'sm':
      return 'w-2 h-2'
    case 'md':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    default:
      return 'w-2 h-2'
  }
}
