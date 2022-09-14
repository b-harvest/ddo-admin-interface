import Icon from 'components/Icon'
import { useState } from 'react'

type CheckboxProps = { label: string; onChange: (checked: boolean) => void; defaultChecked?: boolean }

export default function Checkbox({ label, onChange, defaultChecked = false }: CheckboxProps) {
  const [checked, setChecked] = useState<boolean>(defaultChecked)

  const handleChange = () => {
    const newChecked = !checked
    setChecked(newChecked)
    onChange(newChecked)
  }

  return (
    <div className="relative inline-flex justify-start items-center gap-x-2">
      <div className="relative">
        <Icon
          type={checked ? 'checked' : 'unchecked'}
          className={`${checked ? 'text-glowCRE' : 'text-grayCRE-300 dark:text-grayCRE-400'} cursor-pointer`}
        />
        <input
          type="checkbox"
          id={label}
          checked={defaultChecked}
          onChange={handleChange}
          className="absolute top-0 right-0 bottom-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <label
        htmlFor={label}
        className="TYPO-BODY-S text-grayCRE-400 dark:text-grayCRE-300 hover:opacity-60 cursor-pointer"
      >
        {label}
      </label>
    </div>
  )
}
