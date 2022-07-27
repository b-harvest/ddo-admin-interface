import AppPage from 'components/AppPage'
import { useParams } from 'react-router-dom'

export default function Token() {
  const { id }: { id: string } = useParams()
  console.log('id', id)

  return (
    <AppPage>
      <></>
    </AppPage>
  )
}
