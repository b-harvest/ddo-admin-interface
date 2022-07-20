import Timeline from 'components/Timeline'

export default function CreAlertTimeline() {
  return (
    <section className="pl-4">
      <header className="flex flex-col justify-start align-stretch space-y-6 mb-4">
        <h3 className="flex justify-start items-center TYPO-H3 text-black dark:text-white text-left">
          creAlert Timeline
        </h3>
      </header>

      <div className="p-4 pl-0">
        <Timeline />
      </div>
    </section>
  )
}
