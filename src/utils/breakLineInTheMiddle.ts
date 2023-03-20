export default function breakInTheMiddle(str: string, length: 10 | 20 | 30) {
  if (str.length >= length) {
    return `${str.substring(0, length / 2)}...${str.substring(str.length - length / 2, str.length)}`
  }
  return str
}
