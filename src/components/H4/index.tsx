export default function H4({ title, className = '' }: { title: string; className?: string }) {
  return (
    <h4 className={`flex justify-start items-center TYPO-H4 text-black dark:text-white text-left ${className}`}>
      {title}
    </h4>
  )
}
