import IconButton from 'components/IconButton'

const WARN_BUTTON_CSS = `TYPO-BODY-M w-[40px] flex justify-center`

export default function LSVVotingWarnButton({
  onClick,
  warned,
  penalized,
}: {
  onClick: () => void
  warned: boolean
  penalized: boolean
}) {
  // modal
  //   const [modal, setModal] = useState<boolean>(false)
  //   const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  //   const [modalRefLink, setModalRefLink] = useState<string>('')
  //   const [modalMemo, setModalMemo] = useState<string>('')

  //   const onClose = () => {
  //     setModal(false)
  //     setIsModalLoading(false)
  //   }

  //   const onSave = () => {
  //     setIsModalLoading(true)
  //     if (lsv) {
  //       const postData: LSVPenaltyWarnPost = {
  //         addr: lsv.addr,
  //         desc: `${modalRefLink}---${modalMemo}`,
  //         proposalId,
  //       }
  //     }
  //   }

  //   const onButtonClick = () => {
  //     setModal(true)
  //   }

  return (
    <>
      {penalized ? (
        <IconButton type="error" onClick={onClick} className={`${WARN_BUTTON_CSS} text-error`} />
      ) : warned ? (
        <IconButton type="warning" onClick={onClick} className={`${WARN_BUTTON_CSS} text-warning`} />
      ) : (
        <IconButton
          type="plus"
          onClick={onClick}
          className={`${WARN_BUTTON_CSS} text-grayCRE-300 hover:text-grayCRE-200`}
        />
        //     <Button
        //       size="xs"
        //       color={warned ? 'neutral' : 'primary'}
        //       label={warned ? 'Warned' : 'Add'}
        //       disabled={warned}
        //       isLoading={false}
        //       onClick={() => onClick(proposalId)}
        //     />
      )}
      {/* 
      <Modal active={modal} onClose={onClose} onOk={onSave} okButtonLabel="Save" isLoading={isModalLoading}>
        <H4 title={`${lsv.alias} warned to vote on #${proposalId}?`} className="mb-4" />
        <div className="space-y-2">
          <Input type="text" placeholder="Reference link" keyword={modalRefLink} onChange={setModalRefLink} />
          <Textarea placeholder="Memo (optional)" keyword={modalMemo} onChange={setModalMemo} />
        </div>
      </Modal> */}
    </>
  )
}
