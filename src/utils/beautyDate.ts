export default (rawDate: string) => {
  const s = rawDate ? rawDate.split('-') : null
  return s ? `${s[0]}年${s[1]}/${s[2]}` : null 
}
