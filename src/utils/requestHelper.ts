export interface FetchData<T> {
  error: boolean
  data?: T
}

export async function fetchHelper<DataType>(url: string, options: any): Promise<FetchData<DataType>> {
  try {
    const urlWithParams = new URL(url)
    Object.keys(options).forEach((key) => urlWithParams.searchParams.append(key, options[key]))
    const response = await fetch(urlWithParams.toString())

    if (response.ok) {
      const data = (await response.json()) as DataType
      return { error: false, data }
    }
  } catch (error) {
    console.error('Failed to fetch data: ', error)
  }

  return { error: true }
}

export async function postHelper<DataType>(url: string, params: any): Promise<FetchData<DataType>> {
  try {
    const options = { method: 'POST', body: JSON.stringify(params) }
    const response = await fetch(new URL(url).toString(), options)

    if (response.ok) {
      const data = (await response.json()) as DataType
      return { error: false, data }
    }
  } catch (error) {
    console.error('Failed to fetch data: ', error)
  }

  return { error: true }
}
