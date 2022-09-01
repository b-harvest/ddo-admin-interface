interface LoaderProps {
  size?: string
  stroke?: string
  [key: string]: any
}

export default function Loader({ size = '32', stroke, ...rest }: LoaderProps) {
  return (
    <div className="flex justify-center items-center w-full h-full bg-transparent">
      <div className="w-max h-max flex items-center justify-center p-[2px]">
        <div className="w-10 h-10 border-b-[3px] rounded-full border-grayCRE-100-l dark:border-grayCRE-500-d animate-spin"></div>
      </div>
    </div>
  )
}
