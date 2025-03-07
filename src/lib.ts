import { Client } from "@googlemaps/google-maps-services-js";

interface Coordinates {
  lat: number;
  lng: number;
}

class GeoLib {
  private readonly client: Client;

  constructor() {
    this.client = new Client({});
  }

  private validateCoordinates(
    coordinates: [number, number] | Coordinates
  ): void {
    const lat = Array.isArray(coordinates) ? coordinates[0] : coordinates.lat;
    const lng = Array.isArray(coordinates) ? coordinates[1] : coordinates.lng;

    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }

    if (lng < -180 || lng > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }
  }

  public async getAddressFromCoordinates(
    coordinates: [number, number] | Coordinates
  ): Promise<string> {
    try {
      this.validateCoordinates(coordinates);

      const { data } = await this.client.reverseGeocode({
        params: {
          key: process.env.MAPS_API_KEY,
          latlng: coordinates,
        },
      });

      if (!data.results || data.results.length === 0) {
        throw new Error("No address found for these coordinates");
      }

      return data.results[0].formatted_address;
    } catch (error) {
      throw new Error(`Failed to get address: ${error.message}`);
    }
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<Coordinates> {
    try {
      const { data } = await this.client.geocode({
        params: {
          key: process.env.MAPS_API_KEY,
          address,
        },
      });

      if (!data.results || data.results.length === 0) {
        throw new Error("No coordinates found for this address");
      }

      return data.results[0].geometry.location;
    } catch (error) {
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  }
}

export default new GeoLib();
