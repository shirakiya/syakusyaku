const colorMapping = {
  red: '#F44336',
  blue: '#2196F3',
  orange: '#FF9800',
  green: '#4CAF50',
  purple: '#9C27B0',
}

export function getColorAliasByNum(num) {
  const aliasKeys = Object.keys(colorMapping)
  const normalizedNum = num % aliasKeys.length

  return aliasKeys[normalizedNum]
}

export function getColorCode(alias) {
  return (alias in colorMapping) ? colorMapping[alias] : null
}

export function getColorCodeByNum(num) {
  const alias = getColorAliasByNum(num)

  return getColorCode(alias)
}
