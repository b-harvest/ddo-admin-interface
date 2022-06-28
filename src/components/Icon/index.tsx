import React from 'react'
import { IconContext } from 'react-icons'
import { AiOutlineInfoCircle, AiOutlineLoading3Quarters, AiOutlinePlus, AiOutlineWarning } from 'react-icons/ai'
import { BiLinkExternal } from 'react-icons/bi'
import { BsGithub, BsMedium, BsTwitter } from 'react-icons/bs'
import { CgFileDocument } from 'react-icons/cg'
import { FaRegBell } from 'react-icons/fa'
import { FaBan, FaRegCheckCircle, FaTelegramPlane } from 'react-icons/fa'
import { FiBookOpen } from 'react-icons/fi'
import { GiReceiveMoney, GiToken } from 'react-icons/gi'
import { GiHamburgerMenu } from 'react-icons/gi'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { IoIosMore, IoMdArrowRoundForward, IoMdClose } from 'react-icons/io'
import { MdExpandLess, MdExpandMore, MdOutlineContentCopy, MdOutlineSearch } from 'react-icons/md'
import { MdAccessTime } from 'react-icons/md'
import { RiArrowLeftRightLine, RiZzzLine } from 'react-icons/ri'
import { SiDiscord, SiGitbook } from 'react-icons/si'

export type IconType =
  | 'close'
  | 'copy'
  | 'link'
  | 'noti'
  | 'more'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'forward'
  | 'search'
  | 'swap'
  | 'plus'
  | 'loading'
  | 'expandmore'
  | 'expandless'
  | 'time'
  | 'receivemoney'
  | 'sleep'
  | 'docs'
  | 'medium'
  | 'twitter'
  | 'discord'
  | 'telegram'
  | 'terms'
  | 'token'
  | 'github'
  | 'gitbook'
  | 'checked'
  | 'unchecked'
  | 'hamburger'

const Icons: { [key: string]: React.ElementType } = {
  close: IoMdClose,
  copy: MdOutlineContentCopy,
  link: BiLinkExternal,
  noti: FaRegBell,
  more: IoIosMore,
  success: FaRegCheckCircle,
  warning: AiOutlineWarning,
  error: FaBan,
  info: AiOutlineInfoCircle,
  forward: IoMdArrowRoundForward,
  search: MdOutlineSearch,
  swap: RiArrowLeftRightLine,
  plus: AiOutlinePlus,
  loading: AiOutlineLoading3Quarters,
  expandmore: MdExpandMore,
  expandless: MdExpandLess,
  time: MdAccessTime,
  receivemoney: GiReceiveMoney,
  sleep: RiZzzLine,
  docs: FiBookOpen,
  medium: BsMedium,
  twitter: BsTwitter,
  discord: SiDiscord,
  telegram: FaTelegramPlane,
  terms: CgFileDocument,
  github: BsGithub,
  gitbook: SiGitbook,
  token: GiToken,
  checked: ImCheckboxChecked,
  unchecked: ImCheckboxUnchecked,
  hamburger: GiHamburgerMenu,
}

interface IconProps {
  type: IconType
  className?: string
}

function Icon({ type, className = '' }: IconProps) {
  const Icon = Icons[type]
  //   as ReactNode

  return (
    <IconContext.Provider
      value={{
        className: `${className}`,
      }}
    >
      {/* @ts-ignore */}
      <Icon />
    </IconContext.Provider>
  )
}

export default Icon
