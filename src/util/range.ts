export const range = (length: number, start = 0) => {
  return Array.from({ length }, (_, index) => index + start)
}
