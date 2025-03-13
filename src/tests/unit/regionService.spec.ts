import chai, { expect } from "chai";
import sinon from "sinon";
import { RegionService } from "../../services/regionService";
import { RegionRepository } from "../../repositories/regionRepository";
import { AppError, STATUS_CODE } from "../../errors/AppError";
import { generateMockRegionWithId, mockRegion } from "../mocks/regionMocks";
import { generateMockUserWithId } from "../mocks/userMocks";
import { GeoJSONPoint } from "../../models/regionModel";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("RegionService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("create", () => {
    it("should create a region successfully", async () => {
      const mockUser = await generateMockUserWithId();
      const regionData = mockRegion(mockUser._id);
      const createdRegion = generateMockRegionWithId(mockUser._id);

      sandbox.stub(RegionRepository, "findByCoordinates").resolves(null);
      sandbox.stub(RegionRepository, "create").resolves(createdRegion);

      const result = await RegionService.create(regionData);

      expect(result).to.deep.equal(createdRegion);
      expect(RegionRepository.findByCoordinates).to.have.been.calledWith(
        regionData.geometry,
      );
      expect(RegionRepository.create).to.have.been.calledWith(regionData);
    });

    it("should throw an error if region already exists", async () => {
      const mockUser = await generateMockUserWithId();
      const regionData = mockRegion(mockUser._id);
      const existingRegion = generateMockRegionWithId(mockUser._id);

      sandbox
        .stub(RegionRepository, "findByCoordinates")
        .resolves(existingRegion);

      try {
        await RegionService.create(regionData);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.CONFLICT);
        expect(error.message).to.equal("Region already exists");
      }
    });
  });

  describe("findAll", () => {
    it("should return regions and total count", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegions = [
        generateMockRegionWithId(mockUser._id),
        generateMockRegionWithId(mockUser._id),
      ];
      const total = mockRegions.length;

      sandbox
        .stub(RegionRepository, "findAll")
        .resolves({ regions: mockRegions, total });

      const result = await RegionService.findAll(1, 10);

      expect(result).to.deep.equal({ regions: mockRegions, total });
      expect(RegionRepository.findAll).to.have.been.calledWith(0, 10);
    });

    it("should throw an error if no regions found", async () => {
      sandbox
        .stub(RegionRepository, "findAll")
        .resolves({ regions: [], total: 0 });

      try {
        await RegionService.findAll(1, 10);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("No regions found");
      }
    });
  });

  describe("findById", () => {
    it("should return region by ID", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegion = generateMockRegionWithId(mockUser._id);

      sandbox.stub(RegionRepository, "findById").resolves(mockRegion);

      const result = await RegionService.findById(mockRegion._id);

      expect(result).to.deep.equal(mockRegion);
      expect(RegionRepository.findById).to.have.been.calledWith(mockRegion._id);
    });

    it("should throw an error if region not found", async () => {
      const regionId = "nonexistent-id";

      sandbox.stub(RegionRepository, "findById").resolves(null);

      try {
        await RegionService.findById(regionId);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("Region not found");
      }
    });
  });

  describe("makeGeoJsonPoint", () => {
    it("should convert string coordinates to GeoJSON Point", () => {
      const pointString = "10.123,-20.456";
      const expected = {
        type: "Point",
        coordinates: [10.123, -20.456],
      };

      const result = RegionService.makeGeoJsonPoint(pointString);

      expect(result).to.deep.equal(expected);
    });
  });

  describe("findByPoint", () => {
    it("should find regions containing a point", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegions = [
        generateMockRegionWithId(mockUser._id),
        generateMockRegionWithId(mockUser._id),
      ];
      const pointString = "10.123,-20.456";
      const geoJsonPoint = {
        type: "Point",
        coordinates: [10.123, -20.456],
      } as GeoJSONPoint;

      const makeGeoJsonPointStub = sandbox
        .stub(RegionService, "makeGeoJsonPoint")
        .returns(geoJsonPoint);
      sandbox.stub(RegionRepository, "findByPoint").resolves(mockRegions);

      const result = await RegionService.findByPoint(pointString);

      expect(result).to.deep.equal(mockRegions);
      expect(makeGeoJsonPointStub).to.have.been.calledWith(pointString);
      expect(RegionRepository.findByPoint).to.have.been.calledWith(
        geoJsonPoint,
      );
    });

    it("should throw an error if no regions found", async () => {
      const pointString = "10.123,-20.456";
      const geoJsonPoint = {
        type: "Point",
        coordinates: [10.123, -20.456],
      } as GeoJSONPoint;

      sandbox.stub(RegionService, "makeGeoJsonPoint").returns(geoJsonPoint);
      sandbox.stub(RegionRepository, "findByPoint").resolves([]);

      try {
        await RegionService.findByPoint(pointString);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("Regions not found");
      }
    });
  });

  describe("findByDistance", () => {
    it("should find regions within a distance", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegions = [
        generateMockRegionWithId(mockUser._id),
        generateMockRegionWithId(mockUser._id),
      ];
      const pointString = "10.123,-20.456";
      const geoJsonPoint = {
        type: "Point",
        coordinates: [10.123, -20.456],
      } as GeoJSONPoint;
      const maxDistance = 1000;

      const makeGeoJsonPointStub = sandbox
        .stub(RegionService, "makeGeoJsonPoint")
        .returns(geoJsonPoint);
      sandbox.stub(RegionRepository, "findByDistance").resolves(mockRegions);

      const result = await RegionService.findByDistance(
        pointString,
        maxDistance,
        mockUser._id,
      );

      expect(result).to.deep.equal(mockRegions);
      expect(makeGeoJsonPointStub).to.have.been.calledWith(pointString);
      expect(RegionRepository.findByDistance).to.have.been.calledWith(
        geoJsonPoint,
        maxDistance,
        mockUser._id,
      );
    });

    it("should throw an error if no regions found", async () => {
      const mockUser = await generateMockUserWithId();
      const pointString = "10.123,-20.456";
      const geoJsonPoint = {
        type: "Point",
        coordinates: [10.123, -20.456],
      } as GeoJSONPoint;
      const maxDistance = 1000;

      sandbox.stub(RegionService, "makeGeoJsonPoint").returns(geoJsonPoint);
      sandbox.stub(RegionRepository, "findByDistance").resolves([]);

      try {
        await RegionService.findByDistance(
          pointString,
          maxDistance,
          mockUser._id,
        );
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("Regions not found");
      }
    });
  });

  describe("update", () => {
    it("should update region", async () => {
      const mockUser = await generateMockUserWithId();
      const mockedRegion = generateMockRegionWithId(mockUser._id);
      const updateData = mockRegion(mockUser._id);

      sandbox.stub(RegionRepository, "findById").resolves(mockedRegion);
      sandbox
        .stub(RegionRepository, "findByIdAndUpdate")
        .resolves({ _id: mockedRegion._id, ...updateData });

      const result = await RegionService.update(
        mockedRegion._id,
        updateData,
        mockUser._id,
      );

      expect(result).to.deep.equal({ _id: mockedRegion._id, ...updateData });
      expect(RegionRepository.findById).to.have.been.calledWith(
        mockedRegion._id,
      );
      expect(RegionRepository.findByIdAndUpdate).to.have.been.calledWith(
        mockedRegion._id,
        updateData,
      );
    });

    it("should throw an error if region not found", async () => {
      const mockUser = await generateMockUserWithId();
      const regionId = "nonexistent-id";
      const updateData = mockRegion(mockUser._id);

      sandbox.stub(RegionRepository, "findById").resolves(null);

      try {
        await RegionService.update(regionId, updateData, mockUser._id);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("Region not found");
      }
    });

    it("should throw an error if user is not authorized", async () => {
      const mockUser = await generateMockUserWithId();
      const mockedRegion = generateMockRegionWithId("different-user-id");
      mockedRegion.user = "different-user-id";

      const updateData = mockRegion(mockUser._id);

      sandbox.stub(RegionRepository, "findById").resolves(mockedRegion);

      try {
        await RegionService.update(mockedRegion._id, updateData, mockUser._id);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.UNAUTHORIZED);
        expect(error.message).to.equal("Not authorized");
      }
    });
  });

  describe("delete", () => {
    it("should delete region", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegion = generateMockRegionWithId(mockUser._id);
      mockRegion.user = mockUser._id;

      sandbox.stub(RegionRepository, "findById").resolves(mockRegion);
      sandbox.stub(RegionRepository, "delete").resolves();

      await RegionService.delete(mockRegion._id, mockUser._id);

      expect(RegionRepository.findById).to.have.been.calledWith(mockRegion._id);
      expect(RegionRepository.delete).to.have.been.calledWith(mockRegion._id);
    });

    it("should throw an error if region not found", async () => {
      const mockUser = await generateMockUserWithId();
      const regionId = "nonexistent-id";

      sandbox.stub(RegionRepository, "findById").resolves(null);

      try {
        await RegionService.delete(regionId, mockUser._id);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("Region not found");
      }
    });

    it("should throw an error if user is not authorized", async () => {
      const mockUser = await generateMockUserWithId();
      const mockRegion = generateMockRegionWithId("different-user-id");
      mockRegion.user = "different-user-id";

      sandbox.stub(RegionRepository, "findById").resolves(mockRegion);

      try {
        await RegionService.delete(mockRegion._id, mockUser._id);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.UNAUTHORIZED);
        expect(error.message).to.equal("Not authorized");
      }
    });
  });
});
