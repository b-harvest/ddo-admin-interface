import { toast } from 'react-toastify'

export const toastNeutral = (msg: string) => {
  toast(msg, {})
}

export const toastInfo = (msg: string | JSX.Element) => {
  toast.info('', {})
}

export const toastSuccess = (msg: string | JSX.Element) => {
  toast.success(msg, {})
}

export const toastWarning = (msg: string | JSX.Element) => {
  toast.warn(msg, {})
}

export const toastError = (msg: string | JSX.Element) => {
  toast.error(msg, {})
}

// export toastOnPost = ({ success, message }) => {

// }
