export default function H3({ title, className = '' }: { title: string; className?: string }) {
  return (
    <h3 className={`flex justify-start items-center TYPO-H3 text-black dark:text-white text-left ${className}`}>
      {title}
    </h3>
  )
}
