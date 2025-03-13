import chai, { expect } from "chai";
import sinon from "sinon";
import GeoLib from "../../lib";
import { Client } from "@googlemaps/google-maps-services-js";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
describe("GeoLib", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getAddressFromCoordinates", () => {
    it("should return address for valid coordinates", async () => {
      const mockAddress: string = "123 Main St, City, Country";
      const mockCoordinates: [number, number] = [10, 20];

      const reverseGeocodingStub = sandbox.stub().resolves({
        data: {
          results: [{ formatted_address: mockAddress }],
        },
      });

      sandbox
        .stub(Client.prototype, "reverseGeocode")
        .callsFake(reverseGeocodingStub);

      const result = await GeoLib.getAddressFromCoordinates(mockCoordinates);

      expect(result).to.equal(mockAddress);
      expect(reverseGeocodingStub.callCount).to.equal(1);
    });

    it("should throw error if no results found", async () => {
      const mockCoordinates: [number, number] = [10, 20];

      const reverseGeocodingStub = sandbox.stub().resolves({
        data: {
          results: [],
        },
      });

      sandbox
        .stub(Client.prototype, "reverseGeocode")
        .callsFake(reverseGeocodingStub);

      try {
        await GeoLib.getAddressFromCoordinates(mockCoordinates);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include("No address found");
      }
    });

    it("should validate coordinates are within bounds", async () => {
      const invalidLng: [number, number] = [200, 20];
      const invalidLat: [number, number] = [10, 100];

      try {
        await GeoLib.getAddressFromCoordinates(invalidLng);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include(
          "Longitude must be between -180 and 180 degrees",
        );
      }

      try {
        await GeoLib.getAddressFromCoordinates(invalidLat);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include(
          "Latitude must be between -90 and 90 degrees",
        );
      }
    });
  });

  describe("getCoordinatesFromAddress", () => {
    it("should return coordinates for valid address", async () => {
      const mockAddress = "123 Main St, City, Country";
      const mockCoordinates = { lat: 20, lng: 10 };

      const geocodingStub = sandbox.stub().resolves({
        data: {
          results: [{ geometry: { location: mockCoordinates } }],
        },
      });

      sandbox.stub(Client.prototype, "geocode").callsFake(geocodingStub);

      const result = await GeoLib.getCoordinatesFromAddress(mockAddress);

      expect(result).to.deep.equal(mockCoordinates);
      expect(geocodingStub.callCount).to.equal(1);
    });

    it("should throw error if no results found", async () => {
      const mockAddress = "Invalid Address";

      const geocodingStub = sandbox.stub().resolves({
        data: {
          results: [],
        },
      });

      sandbox.stub(Client.prototype, "geocode").callsFake(geocodingStub);

      try {
        await GeoLib.getCoordinatesFromAddress(mockAddress);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include("No coordinates found");
      }
    });
  });
});
