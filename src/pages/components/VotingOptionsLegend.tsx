import VotingOptionIcon from 'components/VotingOptionIcon'

const OPTIONS = [1, 2, 3, 4, 5, 6]

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

function getVotingOptionLabel(option: number, mobile: boolean) {
  switch (option) {
    case 1:
      return mobile ? 'Y' : 'Yes'
    case 2:
      return mobile ? 'N' : 'No' // no
    case 3:
      return mobile ? 'Veto' : 'No /w veto' // no w/ veto
    case 4:
      return 'Abstain' // abstain
    case 5:
      return 'Did not' // didn't vote
    default:
      return 'NA'
  }
}
