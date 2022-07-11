export default function AppTopBanner({ label }: { label: string }) {
  return (
    <div className="w-full h-6 flex justify-center items-center bg-rose-600 TYPO-BODY-S text-white !font-black origin-top animate-top-banner-scaleY">
      {label}
    </div>
  )
}
