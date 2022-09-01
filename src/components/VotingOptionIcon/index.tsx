import type { IconType } from 'components/Icon'
import Icon from 'components/Icon'
import { VOTE_OPTIONS } from 'constants/lsv'
import { useMemo } from 'react'

export default function VotingOptionIcon({ option }: { option?: VOTE_OPTIONS }) {
  const iconColor = useMemo<string>(() => {
    switch (option) {
      case VOTE_OPTIONS.NA:
        return 'text-grayCRE-300 dark:text-grayCRE-400'
      case VOTE_OPTIONS.Yes:
        return 'text-grayCRE-300 dark:text-grayCRE-200'
      case VOTE_OPTIONS.No:
        return 'text-pinkCRE'
      case VOTE_OPTIONS.Veto:
        return 'text-pinkCRE'
      case VOTE_OPTIONS.Abstain:
        return 'text-warning'
      case VOTE_OPTIONS.DidNot:
        return 'text-error'
      default:
        return 'text-grayCRE-300 dark:text-grayCRE-400'
    }
  }, [option])

  const iconTitle = useMemo<string>(() => {
    switch (option) {
      case VOTE_OPTIONS.NA:
        return '-'
      case VOTE_OPTIONS.Yes:
        return 'Yes'
      case VOTE_OPTIONS.No:
        return 'No' // no
      case VOTE_OPTIONS.Veto:
        return 'No with veto' // no w/ veto
      case VOTE_OPTIONS.Abstain:
        return 'Abstain' // abstain
      case VOTE_OPTIONS.DidNot:
        return 'Did not vote' // didn't vote
      default:
        return '-'
    }
  }, [option])

  const iconType = useMemo<IconType>(() => {
    switch (option) {
      case VOTE_OPTIONS.NA:
        return 'hyphen'
      case VOTE_OPTIONS.Yes:
        return 'like' // yes
      case VOTE_OPTIONS.No:
        return 'dislike' // no
      case VOTE_OPTIONS.Veto:
        return 'filldislike' // no w/ veto
      case VOTE_OPTIONS.Abstain:
        return 'abstain' // abstain
      case VOTE_OPTIONS.DidNot:
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
