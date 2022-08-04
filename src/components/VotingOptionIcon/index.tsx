import type { IconType } from 'components/Icon'
import Icon from 'components/Icon'
import { useMemo } from 'react'

export default function VotingOptionIcon({ option }: { option?: number }) {
  const iconColor = useMemo<string>(() => {
    switch (option) {
      case 1:
        return 'text-grayCRE-300 dark:text-grayCRE-200'
      case 2:
        return 'text-pinkCRE' // no
      case 3:
        return 'text-pinkCRE' // no w/ veto
      case 4:
        return 'text-warning' // abstain
      case 5:
        return 'text-error' // didn't vote
      default:
        return 'text-grayCRE-300 dark:text-grayCRE-400' // didn't vote
    }
  }, [option])

  const iconTitle = useMemo<string>(() => {
    switch (option) {
      case 1:
        return 'Yes'
      case 2:
        return 'No' // no
      case 3:
        return 'No with veto' // no w/ veto
      case 4:
        return 'Abstain' // abstain
      case 5:
        return 'Did not vote' // didn't vote
      default:
        return '-'
    }
  }, [option])

  const iconType = useMemo<IconType>(() => {
    switch (option) {
      case 1:
        return 'like' // yes
      case 2:
        return 'dislike' // no
      case 3:
        return 'filldislike' // no w/ veto
      case 4:
        return 'abstain' // abstain
      case 5:
        return 'close' // didn't vote
      default:
        return 'hyphen'
    }
  }, [option])

  return (
    <div className={iconColor} title={iconTitle}>
      <Icon type={iconType} />
    </div>
  )
}
