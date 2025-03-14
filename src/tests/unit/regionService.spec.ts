/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import sinon from "sinon";
import { RegionService } from "../../services/regionService";
import { RegionRepository } from "../../repositories/regionRepository";
import { generateMockRegionWithId, mockRegion } from "../mocks/regionMocks";
import { Region } from "../../models/regionModel";
import { CreateRegionInput } from "../../types/regionTypes";
import { UserRepository } from "../../repositories/userRepository";
import mongoose from "mongoose";

describe("RegionService Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should create region successfully", async () => {
      const userId = "user123";
      const regionData = mockRegion(userId);

      sinon.stub(RegionRepository, "findByCoordinates").resolves(null);
      sinon.stub(RegionRepository, "create").resolves(regionData as Region);

      const result = await RegionService.create(
        regionData as CreateRegionInput,
      );

      expect(result).to.deep.equal(regionData);
    });

    it("should throw error if region already exists", async () => {
      const userId = "user123";
      const regionData = mockRegion(userId);

      sinon
        .stub(RegionRepository, "findByCoordinates")
        .resolves(regionData as Region);

      try {
        await RegionService.create(regionData as CreateRegionInput);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("Region already exists");
      }
    });
  });

  describe("findByPoint", () => {
    it("should find regions containing point", async () => {
      const point = "-46.6388,-23.5504";
      const regions = [mockRegion("user123")];

      sinon.stub(RegionRepository, "findByPoint").resolves(regions as Region[]);

      const result = await RegionService.findByPoint(point);

      expect(result).to.deep.equal(regions);
    });
  });

  describe("findByDistance", () => {
    it("should find regions within distance", async () => {
      const point = "-46.6388,-23.5504";
      const maxDistance = 1000;
      const regions = [mockRegion("user123")];

      sinon
        .stub(RegionRepository, "findByDistance")
        .resolves(regions as Region[]);

      const result = await RegionService.findByDistance(point, maxDistance);

      expect(result).to.deep.equal(regions);
    });
  });

  describe("update", () => {
    it("should update region successfully", async () => {
      const userId = "user123";
      const regionId = "region123";
      const updateData = { name: "Updated Region" };
      const region = { ...mockRegion(userId), _id: regionId };

      sinon.stub(RegionRepository, "findById").resolves(region as Region);
      sinon
        .stub(RegionRepository, "findByIdAndUpdate")
        .resolves(region as Region);

      const result = await RegionService.update(regionId, updateData, userId);

      expect(result).to.deep.equal(region);
    });

    it("should throw error when updating other user region", async () => {
      const userId = "user123";
      const otherUserId = "other456";
      const regionId = "region123";
      const region = { ...mockRegion(otherUserId), _id: regionId };

      sinon.stub(RegionRepository, "findById").resolves(region as Region);

      try {
        await RegionService.update(regionId, { name: "New Name" }, userId);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("Not authorized");
      }
    });
  });

  describe("delete", () => {
    it("should delete region successfully", async () => {
      const userId = "user123";
      const region = generateMockRegionWithId(userId);

      const sessionMock = {
        startTransaction: sinon.stub(),
        commitTransaction: sinon.stub().resolves(),
        abortTransaction: sinon.stub().resolves(),
        endSession: sinon.stub(),
      };

      sinon.stub(mongoose, "startSession").resolves(sessionMock as any);
      sinon.stub(RegionRepository, "findById").resolves(region as Region);
      sinon.stub(UserRepository, "deleteRegionFromUser").resolves();
      const deleteStub = sinon.stub(RegionRepository, "delete").resolves();

      await RegionService.delete(region._id, userId);

      expect(deleteStub).to.have.been.calledWith(region._id, sessionMock);
      expect(sessionMock.commitTransaction).to.have.been.calledOnce;
      expect(sessionMock.endSession).to.have.been.calledOnce;
    });

    it("should throw error when region not found", async () => {
      sinon.stub(RegionRepository, "findById").resolves(null);

      try {
        await RegionService.delete("regionId", "userId");
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("Region not found");
      }
    });

    it("should throw error when user is not authorized", async () => {
      const userId = "user123";
      const otherUserId = "other456";
      const regionId = "region123";
      const region = { ...mockRegion(otherUserId), _id: regionId };

      sinon.stub(RegionRepository, "findById").resolves(region as Region);

      try {
        await RegionService.delete(regionId, userId);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("Not authorized");
      }
    });
  });
});
