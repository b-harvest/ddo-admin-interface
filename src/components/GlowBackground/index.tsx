export default function GlowBackground({ style }: { style?: { [key: string]: string } }) {
  return (
    <div
      className="absolute top-0 right-0 left-0 bottom-0 max-w-full pointer-events-none"
      style={{
        width: '200vw',
        height: '200vh',
        // background: 'radial-gradient(50% 50% at 50% 50%, rgb(127, 71, 0) 0%, rgba(255, 255, 255, 0) 100%)',
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 148, 10, 0.5) 0%, rgba(255, 255, 255, 0) 100%)',
        ...style,
      }}
    ></div>
  )
}
