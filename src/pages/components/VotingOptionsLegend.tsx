import VotingOptionIcon from 'components/VotingOptionIcon'
import { VOTE_OPTIONS } from 'constants/lsv'

const OPTIONS: VOTE_OPTIONS[] = [
  VOTE_OPTIONS.Yes,
  VOTE_OPTIONS.No,
  VOTE_OPTIONS.Veto,
  VOTE_OPTIONS.Abstain,
  VOTE_OPTIONS.DidNot,
  VOTE_OPTIONS.NA,
]

export default function VotingOptionsLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4">
      {OPTIONS.map((item) => (
        <div key={item} className="flex items-center gap-x-1">
          <VotingOptionIcon option={item} />{' '}
          <div className="TYPO-BODY-XS !font-medium md:TYPO-BODY-S text-grayCRE-300 dark:text-grayCRE-400">
            <span className="inline md:hidden">{getVotingOptionLabel(item, true)}</span>
            <span className="hidden md:inline">{getVotingOptionLabel(item, false)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getVotingOptionLabel(option: VOTE_OPTIONS, mobile: boolean) {
  switch (option) {
    case VOTE_OPTIONS.Yes:
      return mobile ? 'Y' : 'Yes'
    case VOTE_OPTIONS.No:
      return mobile ? 'N' : 'No' // no
    case VOTE_OPTIONS.Veto:
      return mobile ? 'Veto' : 'No /w veto' // no w/ veto
    case VOTE_OPTIONS.Abstain:
      return 'Abstain' // abstain
    case VOTE_OPTIONS.DidNot:
      return 'Did not' // didn't vote
    default:
      return 'NA'
  }
}
