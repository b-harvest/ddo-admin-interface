import { useValidatorsets } from 'data/useLCD'
import { useMemo } from 'react'
import type { ValidatorsByHeightLCD } from 'types/validator'

const useValidators = (height?: string) => {
  const { data: validatorsetsLCDData } = useValidatorsets({ height })

  const validatorsetsLCD = useMemo<ValidatorsByHeightLCD | undefined>(() => {
    return validatorsetsLCDData?.result
  }, [validatorsetsLCDData])

  return {
    validatorsetsLCD,
  }
}

export default useValidators
