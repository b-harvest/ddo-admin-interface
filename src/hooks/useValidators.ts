import { useValidatorsets } from 'data/useLCD'
import { useMemo } from 'react'

const useValidators = (height?: string) => {
  const { data: validatorsetsLCDData } = useValidatorsets({ height })

  const validatorsetsLCD = useMemo(() => {
    return validatorsetsLCDData?.result
  }, [validatorsetsLCDData])
  return {
    validatorsetsLCD,
  }
}

export default useValidators
