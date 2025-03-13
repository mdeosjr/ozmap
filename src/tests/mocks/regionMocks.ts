import { faker } from "@faker-js/faker";
import { Region } from "../../models/regionModel";
import { CreateRegionInput } from "../../types/regionTypes";

export const generatePolygon = (): number[][][] => {
  const centerLng = faker.location.longitude();
  const centerLat = faker.location.latitude();

  const size = 0.01;
  const coordinates: [[number, number][]] = [
    [
      [centerLng - size, centerLat - size],
      [centerLng + size, centerLat - size],
      [centerLng + size, centerLat + size],
      [centerLng - size, centerLat + size],
      [centerLng - size, centerLat - size],
    ],
  ];

  return coordinates;
};

export const mockRegion = (userId: string): CreateRegionInput => ({
  name: faker.location.city(),
  geometry: {
    type: "Polygon",
    coordinates: generatePolygon(),
  },
  user: userId,
});

export const generateMockRegionWithId = (userId: string): Region => {
  const region = mockRegion(userId);

  return {
    _id: faker.string.alphanumeric(24),
    ...region,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const generatePoint = (insidePolygon = true) => {
  if (insidePolygon) {
    const polygon = generatePolygon();
    const centerLng = (polygon[0][0][0] + polygon[0][2][0]) / 2;
    const centerLat = (polygon[0][0][1] + polygon[0][2][1]) / 2;
    return { type: "Point", coordinates: [centerLng, centerLat] };
  } else {
    return {
      type: "Point",
      coordinates: [faker.location.longitude(), faker.location.latitude()],
    };
  }
};
