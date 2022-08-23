import Button from 'components/Button'
import Card from 'components/Card'
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'

type ModalProps = {
  children: ReactNode
  active: boolean
  onOk?: () => void
  onNo?: () => void
  onClose?: () => void
  okButtonLabel?: string
  noButtonLabel?: string
  isLoading: boolean
}

export default function Modal({
  children,
  active,
  onOk,
  onNo,
  onClose,
  okButtonLabel,
  noButtonLabel,
  isLoading,
}: ModalProps) {
  const [scrollY, setScrollY] = useState<number>(window.scrollY)

  useEffect(() => {
    // ..
  }, [active, setScrollY])

  useLayoutEffect(() => {
    if (active) {
      if (window.scrollY > 0) setScrollY(window.scrollY)
      document.body.style.height = '100vh'
    }
  }, [active, setScrollY])

  const handleClose = () => {
    document.body.style.height = 'auto'
    window.scrollTo(0, scrollY)
    if (onClose) onClose()
  }

  const handleBackClick = (evt) => {
    if (evt.target.dataset.name === 'back') handleClose()
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex justify-center items-center bg-white-o dark:bg-black-o backdrop-blur-[10px] transition-all ${
          active ? 'opacity-100 z-[9999] visible' : 'opacity-0 z-0 invisible'
        }`}
        data-name="back"
        onClick={handleBackClick}
      >
        <Card
          useGlassEffect={false}
          saturated={true}
          className={`w-[80%] md:w-[400px] shadow-2xl p-8 ${active ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ transform: active ? `translateY(0)` : `translateY(40px)`, transition: 'all 0.25s' }}
        >
          {children}
          <div className="flex justify-between items-center mt-8">
            <div>
              <Button size="xs" color="transparent" label="←" onClick={handleClose} isLoading={isLoading} />
            </div>
            <div className="w-[50%] flex justify-start-end items-center gap-2">
              {onNo ? (
                <Button
                  size="xs"
                  color="neutral"
                  label={noButtonLabel ?? 'Discard'}
                  onClick={onNo}
                  isLoading={isLoading}
                />
              ) : null}
              {onOk ? (
                <Button
                  size="xs"
                  color="danger"
                  label={okButtonLabel ?? 'Confirm'}
                  onClick={onOk}
                  isLoading={isLoading}
                />
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
