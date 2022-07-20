import { Timeline as AntTimeline } from 'antd'
import { ERROR, GRAY, INFO, SUCCESS, WARNING } from 'constants/style'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { AlertStatus } from 'types/alert'

const newAlert = {
  curTimestamp: 1658306062,
  msg: 'Create a services site',
  status: 'neutral',
}

export default function Timeline() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const oldAlerts = alerts.map((item) => item)
    if (oldAlerts.length >= 10) oldAlerts.shift()
    const timer = setInterval(() => setAlerts([...oldAlerts, newAlert]), 1000)
    return () => clearInterval(timer)
  }, [alerts, setAlerts])

  return (
    <AntTimeline className="w-fit TYPO-BODY-S text-black dark:text-white" reverse>
      {alerts.map((alert, index) => (
        <AntTimeline.Item key={index} color={getColorByStatus(alert.status)}>
          <span className="mr-4">{alert.msg}</span>
          <span className="TYPO-BODY-XS text-grayCRE-400">
            {dayjs(alert.curTimestamp * 1000).format('YYYY MMM DD')}
          </span>
        </AntTimeline.Item>
      ))}
      {/* <AntTimeline.Item
        dot={<ClockCircleOutlined className="AntTimeline-clock-icon" />}
        color={getColorByStatus(alert.status)}
      >
        Technical testing 2015-09-01
      </AntTimeline.Item> */}
    </AntTimeline>
  )
}

function getColorByStatus(status: AlertStatus): string {
  switch (status) {
    case 'info':
      return INFO
    case 'success':
      return SUCCESS
    case 'warning':
      return WARNING
    case 'error':
      return ERROR
    default:
      return GRAY
  }
}
