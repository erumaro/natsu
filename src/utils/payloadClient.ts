const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

export async function getPayloadData<T>(collection: string): Promise<T[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=1000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 1 hour in production, no cache in development
      ...(process.env.NODE_ENV === 'production' && {
        next: { revalidate: 3600 },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    return []
  }
}

export async function getPayloadSingle<T>(collection: string): Promise<T | null> {
  try {
    const items = await getPayloadData<T>(collection)
    return items[0] || null
  } catch (error) {
    console.error(`Error fetching single ${collection}:`, error)
    return null
  }
}
