import type { IconType } from 'components/Icon'
import Icon from 'components/Icon'
import { useMemo } from 'react'

export default function VotingOptionIcon({ option }: { option?: number }) {
  const iconColor = useMemo<string>(() => {
    switch (option) {
      case 1:
        return 'text-success'
      case 2:
        return 'text-error' // no
      case 3:
        return 'text-error' // no w/ veto
      case 4:
        return 'text-warning' // abstain
      default:
        return 'text-grayCRE-400' // didn't vote
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
      default:
        return 'Did not vote' // didn't vote
    }
  }, [option])

  const iconType = useMemo<IconType>(() => {
    switch (option) {
      case 1:
        return 'like' // yes
      case 2:
        return 'dislike' // no
      case 3:
        return 'close' // no w/ veto
      case 4:
        return 'abstain' // abstain
      default:
        return 'hyphen' // didn't vote
    }
  }, [option])

  return (
    <div className={iconColor} title={iconTitle}>
      <Icon type={iconType} />
    </div>
  )
}
