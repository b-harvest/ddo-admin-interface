import VotingOptionIcon from 'components/VotingOptionIcon'
import { VoteOptions } from 'constants/lsv'

const OPTIONS: VoteOptions[] = [
  VoteOptions.YES,
  VoteOptions.NO,
  VoteOptions.VETO,
  VoteOptions.ABSTAIN,
  VoteOptions.DIDNOT,
  VoteOptions.NA,
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

function getVotingOptionLabel(option: VoteOptions, mobile: boolean) {
  switch (option) {
    case VoteOptions.YES:
      return mobile ? 'Y' : 'Yes'
    case VoteOptions.NO:
      return mobile ? 'N' : 'No' // no
    case VoteOptions.VETO:
      return mobile ? 'Veto' : 'No /w veto' // no w/ veto
    case VoteOptions.ABSTAIN:
      return 'Abstain' // abstain
    case VoteOptions.DIDNOT:
      return 'Did not' // didn't vote
    default:
      return 'NA'
  }
}
