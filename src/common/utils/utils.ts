import { Navigation } from '@/src/types/navigation'

export const findThreadCurrent = (title: string, data: Navigation[]) =>
  data.find((item: Navigation) =>
    item?.label?.toLowerCase().includes(title.toLowerCase())
  ) as Navigation

export const opacityToHex = (opacity: number) => {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
}

export const numberFormat = new Intl.NumberFormat('vi-VN')

export const formatTime = (time: number) => {
  // const time = ms / 1000
  const formattedHours = Math.floor(time / 3600)
    .toFixed(0)
    .padStart(1, '0')
  const formattedMinutes = (Math.floor(time / 60) % 60)
    .toFixed(0)
    .padStart(2, '0')
  const formattedSeconds = Math.floor(time % 60)
    .toFixed(0)
    .padStart(2, '0')
  return time >= 3600
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`
}

export const deepMerge = (
  target: { [x: string]: any },
  source: { [x: string]: any }
) => {
  const result = { ...target, ...source }
  const keys = Object.keys(result)

  for (const key of keys) {
    const tprop = target[key]
    const sprop = source[key]
    if (typeof tprop === 'object' && typeof sprop === 'object') {
      result[key] = deepMerge(tprop, sprop)
    }
  }

  return result
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}
