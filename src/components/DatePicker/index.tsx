// eslint-disable-next-line no-restricted-imports
import 'react-datepicker/dist/react-datepicker.css'
import './index.css'

import Icon from 'components/Icon'
import DatePicker from 'react-datepicker'

type DatePickerProps = {
  selected?: Date
  onChange?: (date: Date) => void
  maxDate?: Date
  minDate?: Date
  showTimeSelect?: boolean
}

export default function ReactDatePicker({
  selected = new Date(),
  onChange,
  maxDate,
  minDate,
  showTimeSelect = false,
}: DatePickerProps) {
  const handleChange = (date: Date) => {
    if (onChange) onChange(date)
  }

  return (
    <div className="flex items-center space-x-1 pl-4 w-full md:w-[300px] cursor-pointer text-black dark:text-white rounded-xl border-2 border-grayCRE-200 dark:border-grayCRE-400">
      <Icon type="calendar" className="text-grayCRE-200 dark:text-grayCRE-400" />
      <DatePicker
        dateFormat="M/d, yyyy"
        selected={selected}
        onChange={handleChange}
        showTimeSelect={showTimeSelect}
        maxDate={maxDate}
        minDate={minDate}
      />
    </div>
  )
}
