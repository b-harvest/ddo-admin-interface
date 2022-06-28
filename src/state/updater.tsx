import { useAllAssetInfo } from 'hooks/useAPI'

export default function StateUpdater(): null {
  const { data, isError } = useAllAssetInfo()
  console.log(data, isError)
  return null
}
