import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Modal from 'components/Modal'
import { toastSuccess } from 'components/Toast/generator'
import { postNewLSV } from 'data/api'
import { useMemo, useState } from 'react'
import { NewLSVPost } from 'types/lsv'

type NewLSVPostModalProps = {
  active: boolean
  onClose: () => void
}

export default function NewLSVPostModal({ active, onClose }: NewLSVPostModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [newLSVAlias, setNewLSVAlias] = useState<string>('')
  const [newLSVAddr, setNewLSVAddr] = useState<string>('')
  const [newLSVValOperAddr, setNewLSVValOperAddr] = useState<string>('')

  const okButtonDisabled = useMemo<boolean>(() => {
    return !(newLSVAddr.length && newLSVValOperAddr.length && newLSVAlias.length)
  }, [newLSVAddr, newLSVValOperAddr, newLSVAlias])

  const resetModalInput = () => {
    setNewLSVAddr('')
    setNewLSVValOperAddr('')
    setNewLSVAlias('')
  }

  const terminate = () => {
    setIsLoading(false)
    resetModalInput()
    onClose()
  }

  const onOk = async () => {
    setIsLoading(true)

    const postData: NewLSVPost = {
      json: {
        addr: newLSVAddr,
        valoperAddr: newLSVValOperAddr,
        alias: newLSVAlias,
      },
    }

    const { success } = await postNewLSV(postData)
    if (success) toastSuccess('Saved successfully')

    terminate()
  }

  return (
    <Modal
      active={active}
      onClose={terminate}
      isLoading={isLoading}
      okButtonLabel="Add LSV"
      okButtonColor="primary"
      okButtonDisabled={okButtonDisabled}
      onOk={onOk}
    >
      <H4 title="Got a new LSV?" className="mb-4" />
      <div className="space-y-2">
        <Input type="text" placeholder="LSV name (Alias)" keyword={newLSVAlias} onChange={setNewLSVAlias} />
        <Input type="text" placeholder="Address" keyword={newLSVAddr} onChange={setNewLSVAddr} />
        <Input type="text" placeholder="Operator address" keyword={newLSVValOperAddr} onChange={setNewLSVValOperAddr} />
      </div>
    </Modal>
  )
}
