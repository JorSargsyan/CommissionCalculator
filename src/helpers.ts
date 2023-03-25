import https from 'node:https'

export const roundDecimal = (num: number): number => {
  return Math.round(num * 100) / 100
}

export const getApi = async <T extends unknown>(url: string): Promise<T> => {
  return await new Promise<T>((resolve, reject) => {
    try {
      let data = ''
      https.get(url, (response) => {
        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('end', () => {
          resolve(JSON.parse(data))
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}
