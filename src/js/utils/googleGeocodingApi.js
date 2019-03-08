import { createClient } from '@google/maps'


function initGoogleMapsClient() {
  return createClient({
    key: process.env.GOOGLE_API_KEY,
    Promise: Promise,
  })
}

const googleMapsClient = initGoogleMapsClient()


export async function getGeocoderResultFromAddress(addresses) {
  const responses = await Promise.all(addresses.map(address => {
    return googleMapsClient.geocode({
      address: address,
    }).asPromise()
  }))

  return responses.map(response => response.json.results[0])
}
