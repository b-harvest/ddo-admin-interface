export default function EmptyData({ label, useNarrow = false }: { label: string | JSX.Element; useNarrow?: boolean }) {
  return (
    <div
      className={`w-full  bg-grayCRE-200 dark:bg-neutral-800 TYPO-BODY-S text-grayCRE-400 !font-bold transition-all ${
        useNarrow ? 'rounded-lg p-2' : 'rounded-xl p-4'
      }`}
    >
      {label}
    </div>
  )
}
