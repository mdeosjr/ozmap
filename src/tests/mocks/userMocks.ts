import { faker } from "@faker-js/faker";
import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import {
  UserWithAddressInput,
  UserWithCoordinatesInput,
} from "../../types/userTypes";

export const mockUserWithAddress = (): UserWithAddressInput => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: "Password123!",
  address: "Av. Paulista, 123",
});

export const mockUserWithCoordinates = (): UserWithCoordinatesInput => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: "Password123!",
  coordinates: [faker.location.longitude(), faker.location.latitude()],
});

export const mockHashedPassword = (password: string): string => {
  return bcrypt.hashSync(password, 8);
};

export const generateMockUserWithId = (): User => {
  const mockUser = mockUserWithAddress();
  const hashedPassword = mockHashedPassword(mockUser.password);

  return {
    _id: faker.string.alphanumeric(24),
    ...mockUser,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    coordinates: [faker.location.longitude(), faker.location.latitude()],
    regions: [],
  };
};
