import Button, { ButtonColor } from 'components/Button'
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
  okButtonColor?: ButtonColor
  noButtonColor?: ButtonColor
  okButtonDisabled?: boolean
  noButtonDisabled?: boolean
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
  okButtonColor = 'danger',
  noButtonColor = 'neutral',
  okButtonDisabled = false,
  noButtonDisabled = false,
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
          className={`w-[calc(100%-2rem)] md:w-[400px] shadow-2xl px-6 py-8 ${
            active ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{ transform: active ? `translateY(0)` : `translateY(40px)`, transition: 'all 0.25s' }}
        >
          {children}
          <div className="flex justify-between items-center mt-8">
            <div>
              <Button size="sm" color="transparent" label="←" onClick={handleClose} isLoading={isLoading} />
            </div>
            <div className="min-w-[50%] flex justify-start-end items-center gap-2">
              {onNo ? (
                <Button
                  size="sm"
                  color={noButtonColor}
                  label={noButtonLabel ?? 'Discard'}
                  onClick={onNo}
                  isLoading={isLoading}
                  disabled={noButtonDisabled}
                />
              ) : null}
              {onOk ? (
                <Button
                  size="sm"
                  color={okButtonColor}
                  label={okButtonLabel ?? 'Confirm'}
                  onClick={onOk}
                  isLoading={isLoading}
                  disabled={okButtonDisabled}
                />
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
