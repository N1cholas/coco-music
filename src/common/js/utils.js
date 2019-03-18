export function shuffle (arr) {
  const result = arr.slice()
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = getRandomI(i, len)
    let temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

function getRandomI (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
