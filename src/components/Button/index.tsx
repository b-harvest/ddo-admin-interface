interface ButtonProps {
  onClick: () => void
  label: string
  isLoading: boolean
}

export default function Button({ onClick, label, isLoading }: ButtonProps) {
  return (
    <button
      type="button"
      className={`relative w-full TYPO-BODY-M !font-bold text-neutral-900 hover:text-neutral-600 bg-yellowCRE hover:bg-yellowCRE-active  px-8 py-4 rounded-xl shadow-glow-thin-l transition-opacity ${
        isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      }`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-b-[3px] rounded-full border-grayCRE-100-l dark:border-grayCRE-500-d animate-spin"></div>
        </div>
      ) : (
        label
      )}
    </button>
  )
}
