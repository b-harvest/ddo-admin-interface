import { QueryClient, setupBankExtension } from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { useCallback } from 'react'

const CRE_RPC_API_URL = `https://testnet-rpc.crescent.network`

const useRPC = () => {
  const fetchAllBalance = useCallback(async ({ address }: { address: string }) => {
    const tc = await Tendermint34Client.connect(CRE_RPC_API_URL)
    const client = QueryClient.withExtensions(tc, setupBankExtension)
    console.log('client', client)

    try {
      // const DUMMY_ADDRESS = 'cosmos1le890ld7v2hfsaq7cz5ws8zsdnpmhlysl254u4'
      const res = await client.bank.allBalances(address)
      console.log('res', res)
    } catch (e) {
      console.log('rpc error', e)
    }
  }, [])

  return { fetchAllBalance }
}

export default useRPC
