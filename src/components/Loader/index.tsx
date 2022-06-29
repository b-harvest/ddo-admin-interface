interface LoaderProps {
  size?: string
  stroke?: string
  [key: string]: any
}

export default function Loader({ size = '32', stroke, ...rest }: LoaderProps) {
  return (
    // the below svg is for tmp, not to be used actually
    <svg
      className="animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      stroke={stroke}
      {...rest}
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        stroke={stroke ?? '#000'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
