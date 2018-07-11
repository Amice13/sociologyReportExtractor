
exports.extractInfo = function(text) {
  let info = {}

  // Detect sample size
  let sample = text.match(samplePattern)
  if (sample) {
    info.sample = replaceThousands(sample[0])
  } else {
    sample = text.match(samplePattern2)
    if (sample) info.sample = replaceThousands(sample[0])
  }

  // Detect error rate
  let error = text.match(errorPattern)
  if (error) {
    info.error = error[0].replace(/\s/g, '')
  }
  return info
}

const samplePattern = /(?<=(?:опро|опит|в[ыи]б[оі]р|станов|се?ред|респонд).{0,50})\d+(?:,|\d+|\s|т[иы]с\.|т[иы]сяч)*(?=\s+(?:респонд|человек|осіб|жител(?:ів|ей|ь)|люд(?:ина|ей)|совершеннолет|повноліт|[иі]нтерв))/gi
const samplePattern2 = /(?<=Кількість респондентів\s+[–-]\s+)\d+(?:,|\d+|\s|т[иы]с\.|т[иы]сяч)*/

const errorPattern = /(?<=(?:похибк|погрешн|помилк|ошибк).{1,80})\d(?:[\d,.]+)*\s*%/gi

const replaceThousands = (s) => {
  let number = s.replace(thousandsPattern, (match, p1, p2, p3) => {
    let base = p1
    base = base.replace(/,/g,'.')
    base = base.replace(/\s+/g, '')
    base = parseFloat(base)*1000
    let result = 0
    if (p3) {
      result += base + parseInt(p3.replace(/\s+/g, ''))
    } else
      result += base
    return result
  })
  number = number.replace(/\s+/g, '')
  number = parseFloat(number)
  return number
}

const thousandsPattern = /([\d,\s]+)\s*(т[иы]с\.|т[иы]сяч)\s*(\d+)?/
