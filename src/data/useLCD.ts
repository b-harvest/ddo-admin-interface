import useAppSWR, { lcdReturnGenerator } from 'data/useAppSWR'
import useCosmosSWR from 'data/useCosmosSWR'
import type {
  AirdropClaimLCDRaw,
  BalanceLCDRaw,
  FarmPositionLCDRaw,
  FarmRewardLCDMainnetRaw,
  FarmRewardsLCDRaw,
  StakedLCDMainnetRaw,
  StakedLCDRaw,
} from 'types/account'
import type { LCDResponseViaSWR } from 'types/api'
import type { BlockLCD } from 'types/block'
import type { ProposalLCDRaw } from 'types/proposal'
import type { ValidatorSetsLCDRaw } from 'types/validator'
import { COSMOS_CHAIN_NAME } from 'utils/chainRegistry'

export function useBalanceLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BalanceLCDRaw> = useAppSWR(`/cosmos/bank/v1beta1/balances/${address}`, {
    interval,
    type: 'rpc-rest',
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}

export function useAllFarmRewardsLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<FarmRewardLCDMainnetRaw | FarmRewardsLCDRaw> = useAppSWR(
    `/crescent/farming/v1beta1/rewards/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useFarmStakedLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<StakedLCDMainnetRaw | StakedLCDRaw> = useAppSWR(
    `/crescent/farming/v1beta1/stakings/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useFarmPositionLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<FarmPositionLCDRaw> = useAppSWR(
    `/crescent/farming/v1beta1/positions/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useAirdropClaimLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<AirdropClaimLCDRaw> = useAppSWR(
    `/crescent/claim/v1beta1/airdrops/1/claim_records/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

// lcd only
export function useBlockLCD({ height, fetch = true }: { height?: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BlockLCD> = useAppSWR(`/blocks/${height ?? 'latest'}`, {
    interval,
    type: 'rpc-rest',
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}

export function useValidatorsets({ height, fetch = true }: { height?: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<ValidatorSetsLCDRaw> = useAppSWR(`/validatorsets/${height ?? 'latest'}`, {
    interval,
    type: 'rpc-rest',
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}

export function useAllProposalsLCD({ fetch = true }: { fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<{ proposals: ProposalLCDRaw[] }> = useAppSWR(
    `/cosmos/gov/v1beta1/proposals`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

// cosmos chains
export function useCosmosBlockLCD(
  { chainName, height, fetch = true }: { chainName: COSMOS_CHAIN_NAME; height?: string; fetch?: boolean },
  interval = 0
) {
  const { data, error }: LCDResponseViaSWR<BlockLCD> = useCosmosSWR(`/blocks/${height ?? 'latest'}`, {
    chainName,
    interval,
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}
