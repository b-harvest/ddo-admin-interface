import { toast } from 'react-toastify'

export const toastNeutral = (msg: string) => {
  toast(msg, {
    className: 'bg-darkCRE text-white',
  })
}

export const toastInfo = (msg: string) => {
  toast.info('', {
    // position: toast.POSITION.BOTTOM_RIGHT,
  })
}

export const toastSuccess = (msg: string) => {
  toast.success(msg, {
    // position: toast.POSITION.TOP_CENTER,
  })
}

export const toastWarning = (msg: string) => {
  toast.warn(msg, {
    // position: toast.POSITION.BOTTOM_LEFT,
  })
}

export const toastError = (msg: string) => {
  // console.log('Toast Error')
  toast.error(msg, {
    // position: toast.POSITION.TOP_LEFT,
  })
}
