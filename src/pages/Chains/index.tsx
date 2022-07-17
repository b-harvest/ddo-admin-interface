import AppPage from 'components/AppPage'
import GlowBackground from 'components/GlowBackground'

export default function Chains() {
  return (
    <AppPage>
      <GlowBackground
        style={{
          transform: 'translateY(-150vh) translateX(-50vw)',
        }}
      />
      <GlowBackground
        style={{
          transform: 'translateY(25vh) translateX(75vw)',
        }}
      />
      <section className="flex flex-col justify-between items-center space-y-4 mb-8 md:flex-row md:space-x-4 md:space-y-0"></section>
    </AppPage>
  )
}
