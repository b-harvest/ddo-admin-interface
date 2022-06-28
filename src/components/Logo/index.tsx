interface LogoProp {
  src: string
  alt?: string
  className?: string
}

// would be improved to show images sequentially to have fallbacks
export default function Logo({ src, alt, className }: LogoProp) {
  return (
    <div className={className}>
      <img className="inline-block w-full h-full object-contain" src={src} alt={alt ?? ''} />
    </div>
  )
}
