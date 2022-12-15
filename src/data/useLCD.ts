import useAppSWR from 'data/useAppSWR'
import useCosmosSWR from 'data/useCosmosSWR'
import { lcdReturnGenerator } from 'data/utils'
import type { AirdropClaimLCDRaw, BalanceLCDRaw, LpFarmPositionsLCDRaw, LpFarmRewardsLCDRaw } from 'types/account'
import type { LCDResponseViaSWR } from 'types/api'
import type { BlockLCD } from 'types/block'
import { OrderbooksByPairLCDRaw } from 'types/orderbook'
import type { ProposalLCDRaw } from 'types/proposal'
import type { ValidatorSetsLCDRaw } from 'types/validator'
import { COSMOS_CHAIN_NAME } from 'utils/chainRegistry'

export function useBalanceLCD({ address }: { address: string }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BalanceLCDRaw> = useAppSWR(`/cosmos/bank/v1beta1/balances/${address}`, {
    interval,
    type: 'rpc-rest',
    fetch: address.length > 0,
  })
  return lcdReturnGenerator({ data, error })
}

// export function useAllFarmRewardsLCD({ address }: { address: string }, interval = 0) {
//   const { data, error }: LCDResponseViaSWR<LpFarmRewardsLCD> = useAppSWR(
//     `/crescent/farming/v1beta1/rewards/${address}`,
//     {
//       interval,
//       type: 'rpc-rest',
//       fetch: address.length > 0,
//     }
//   )
//   return lcdReturnGenerator({ data, error })
// }

// export function useFarmStakedLCD({ address }: { address: string }, interval = 0) {
//   const { data, error }: LCDResponseViaSWR<StakedLCDMainnetRaw | StakedLCDRaw> = useAppSWR(
//     `/crescent/farming/v1beta1/stakings/${address}`,
//     {
//       interval,
//       type: 'rpc-rest',
//       fetch: address.length > 0,
//     }
//   )
//   return lcdReturnGenerator({ data, error })
// }

// export function useFarmPositionLCD({ address }: { address: string }, interval = 0) {
//   const { data, error }: LCDResponseViaSWR<FarmPositionLCDRaw> = useAppSWR(
//     `/crescent/farming/v1beta1/positions/${address}`,
//     {
//       interval,
//       type: 'rpc-rest',
//       fetch: address.length > 0,
//     }
//   )
//   return lcdReturnGenerator({ data, error })
// }

/** @summary replace above 3 api */
export function useAllLpFarmRewardsLCD({ address }: { address: string }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<LpFarmRewardsLCDRaw> = useAppSWR(
    `/crescent/lpfarm/v1beta1/rewards/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch: address.length > 0,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useFetchLpFarmRewardsByPoolLCD(
  { address, poolDenom }: { address: string; poolDenom: string },
  interval = 0
) {
  const { data, error }: LCDResponseViaSWR<LpFarmRewardsLCDRaw> = useAppSWR(
    `/crescent/lpfarm/v1beta1/rewards/${address}/${poolDenom}`,
    {
      interval,
      type: 'rpc-rest',
      fetch: address.length > 0,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useAllLpFarmPositionLCD({ address }: { address: string }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<LpFarmPositionsLCDRaw> = useAppSWR(
    `/crescent/lpfarm/v1beta1/positions/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch: address.length > 0,
    }
  )
  return lcdReturnGenerator({ data, error })
}

export function useAirdropClaimLCD({ address }: { address: string }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<AirdropClaimLCDRaw> = useAppSWR(
    `/crescent/claim/v1beta1/airdrops/1/claim_records/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch: address.length > 0,
    }
  )
  return lcdReturnGenerator({ data, error })
}

// lcd only
export function useOrderbooksByPairIdLCD(
  {
    pairId,
    priceUnitPowers = 0,
    numTicks = 100,
    fetch = true,
  }: { pairId: number; priceUnitPowers?: number; numTicks?: number; fetch?: boolean },
  interval = 0
) {
  const { data, error }: LCDResponseViaSWR<{ pairs: OrderbooksByPairLCDRaw[] }> = useAppSWR(
    `/crescent/liquidity/v1beta1/order_books?pair_ids=${pairId}&price_unit_powers=${priceUnitPowers}&num_ticks=${numTicks}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

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
