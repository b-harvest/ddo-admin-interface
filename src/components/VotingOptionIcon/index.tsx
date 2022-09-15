import type { IconType } from 'components/Icon'
import Icon from 'components/Icon'
import { VoteOptions } from 'constants/lsv'
import { useMemo } from 'react'

export default function VotingOptionIcon({ option }: { option?: VoteOptions }) {
  const iconColor = useMemo<string>(() => {
    switch (option) {
      case VoteOptions.NA:
        return 'text-grayCRE-300 dark:text-grayCRE-400'
      case VoteOptions.YES:
        return 'text-grayCRE-300 dark:text-grayCRE-200'
      case VoteOptions.NO:
        return 'text-pinkCRE'
      case VoteOptions.VETO:
        return 'text-pinkCRE'
      case VoteOptions.ABSTAIN:
        return 'text-warning'
      case VoteOptions.DIDNOT:
        return 'text-error'
      default:
        return 'text-grayCRE-300 dark:text-grayCRE-400'
    }
  }, [option])

  const iconTitle = useMemo<string>(() => {
    switch (option) {
      case VoteOptions.NA:
        return '-'
      case VoteOptions.YES:
        return 'Yes'
      case VoteOptions.NO:
        return 'No' // no
      case VoteOptions.VETO:
        return 'No with veto' // no w/ veto
      case VoteOptions.ABSTAIN:
        return 'Abstain' // abstain
      case VoteOptions.DIDNOT:
        return 'Did not vote' // didn't vote
      default:
        return '-'
    }
  }, [option])

  const iconType = useMemo<IconType>(() => {
    switch (option) {
      case VoteOptions.NA:
        return 'hyphen'
      case VoteOptions.YES:
        return 'like' // yes
      case VoteOptions.ABSTAIN:
        return 'abstain' // abstain
      case VoteOptions.NO:
        return 'dislike' // no
      case VoteOptions.VETO:
        return 'filldislike' // no w/ veto
      case VoteOptions.DIDNOT:
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
