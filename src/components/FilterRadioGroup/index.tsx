import { RadioGroup } from '@headlessui/react'
import { useEffect, useMemo, useState } from 'react'

export const TAB_RADIO_GROUP_DEFAULT_OPTION = { value: 'all', label: 'All' }

export interface FilterRadioGroupOption {
  value: string
  label: string
}

interface FilterRadioGroupProps {
  defaultIndex?: number
  onSelect: (selected: FilterRadioGroupOption) => void
  options: FilterRadioGroupOption[]
}

export default function FilterRadioGroup({ defaultIndex = 0, onSelect, options }: FilterRadioGroupProps) {
  const radioOptions = useMemo(() => [TAB_RADIO_GROUP_DEFAULT_OPTION].concat(options), [options])

  const [selected, setSelected] = useState<FilterRadioGroupOption>(radioOptions[defaultIndex] ?? radioOptions[0])

  useEffect(() => {
    onSelect(selected)
  }, [selected, onSelect])

  return (
    <div className="w-full">
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">Table Filters</RadioGroup.Label>
        <div className="flex space-x-2 p-[2px] overflow-x-auto overflow-y-hidden">
          {radioOptions.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option}
              className={({ active, checked }) =>
                `${
                  active
                    ? 'ring-2 ring-darkCRE dark:ring-neutral-600 ring-opacity-60 ring-offset-0 ring-offset-white'
                    : ''
                }
                  ${
                    checked
                      ? 'bg-darkCRE dark:bg-grayCRE-300 bg-opacity-75 text-white !font-medium'
                      : 'bg-grayCRE-200 dark:bg-neutral-700'
                  }
                    shrink-0 relative flex TYPO-BODY-S px-4 py-2 cursor-pointer rounded-xl focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="TYPO-BODY-S">
                        <RadioGroup.Label
                          as="div"
                          className={`font-medium  ${checked ? 'text-white' : 'text-gray-900 dark:text-grayCRE-200'}`}
                        >
                          {option.label}
                        </RadioGroup.Label>
                        {/* <RadioGroup.Description
                            as="span"
                            className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'}`}
                          ></RadioGroup.Description> */}
                      </div>
                    </div>
                    {/* {checked && (
                            <div className="shrink-0 text-white">
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )} */}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

// function CheckIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" {...props}>
//       <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
//       <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   )
// }
