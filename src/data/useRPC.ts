import { QueryClient, setupBankExtension } from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useMemo } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import type { BalanceRPC } from 'types/account'

const CRE_MAINNET_RPC_ENDPOINT = `https://mainnet.crescent.network:26657/`
const CRE_TESTNET_RPC_ENDPOINT = `https://testnet-endpoint.crescent.network/rpc/crescent`

const useRPC = () => {
  const [chainIdAtom] = useAtom(chainIdAtomRef)

  const rpcEndpoint = useMemo(
    () => (chainIdAtom === CHAIN_IDS.MOONCAT ? CRE_TESTNET_RPC_ENDPOINT : CRE_MAINNET_RPC_ENDPOINT),
    [chainIdAtom]
  )

  const fetchAllBalance = useCallback(
    async ({ address }: { address: string }) => {
      const tc = await Tendermint34Client.connect(rpcEndpoint)
      const client = QueryClient.withExtensions(tc, setupBankExtension)

      try {
        const balanceRPC: BalanceRPC[] = await client.bank.allBalances(address)
        return balanceRPC
      } catch (e) {
        console.log('[ERROR] client.bank.allBalances', e)
        return null
      }
    },
    [rpcEndpoint]
  )

  return { fetchAllBalance }
}

export default useRPC
