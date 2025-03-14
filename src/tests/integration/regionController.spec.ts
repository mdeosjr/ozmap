/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import request from "supertest";
import server from "../../index";
import { RegionModel } from "../../models/regionModel";
import { UserModel } from "../../models/userModel";
import { mockRegion } from "../mocks/regionMocks";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { mockUserWithAddress } from "../mocks/userMocks";
import ObjectId = mongoose.Types.ObjectId;

describe("RegionController Integration Tests", () => {
  let token: string;
  let userId: string;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  beforeEach(async () => {
    try {
      await RegionModel.deleteMany({});
      await UserModel.deleteMany({});

      const userData = mockUserWithAddress();
      const user = await UserModel.create(userData);
      userId = String(user._id);
      token = jwt.sign(
        { id: userId, email: user.email },
        process.env.JWT_SECRET_KEY,
      );
    } catch (error) {
      console.error("Error in beforeEach:", error);
      throw error;
    }
  });

  describe("GET /api/regions", () => {
    it("should get all regions", async () => {
      const region1 = mockRegion(userId);
      const region2 = mockRegion(userId);

      await RegionModel.create([region1, region2]);

      const response = await request(server).get("/api/regions");

      expect(response.status).to.equal(200);
      expect(Array.isArray(response.body.rows)).to.be.true;
      expect(response.body.rows).to.have.length(2);
      expect(response.body.total).to.equal(2);
    });
  });

  describe("POST /api/regions", () => {
    it("should create region successfully", async () => {
      const regionData = mockRegion(userId);

      const response = await request(server)
        .post("/api/regions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: regionData.name,
          geometry: regionData.geometry,
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("name", regionData.name);
    });

    it("should return 401 without token", async () => {
      const response = await request(server)
        .post("/api/regions")
        .send(mockRegion(userId));

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/regions/by-point", () => {
    it("should find regions by point", async () => {
      const centerPoint = [-46.6388, -23.5504];
      const region = mockRegion(userId, centerPoint);
      await RegionModel.create(region);

      const point = `${centerPoint[0]},${centerPoint[1]}`;
      const response = await request(server).get(
        `/api/regions/by-point?point=${point}`,
      );

      expect(response.status).to.equal(200);
      expect(Array.isArray(response.body)).to.be.true;
      expect(response.body).to.have.length.greaterThan(0);
    });

    it("should return 400 with invalid point", async () => {
      const response = await request(server).get("/api/regions/by-point");
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal("Coordinates must be provided");
    });
  });

  describe("GET /api/regions/by-distance", () => {
    it("should return 400 when parameters are missing", async () => {
      const response = await request(server)
        .get("/api/regions/by-distance")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(400);
    });
  });

  describe("GET /api/regions/:id", () => {
    it("should get region by id", async () => {
      const region = await RegionModel.create(mockRegion(userId));

      const response = await request(server).get(`/api/regions/${region._id}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("name", region.name);
    });

    it("should return 404 when region not found", async () => {
      const response = await request(server).get(
        `/api/regions/${new ObjectId().toString()}`,
      );

      expect(response.status).to.equal(404);
    });
  });

  describe("PATCH /api/regions/:id", () => {
    it("should update region successfully", async () => {
      const region = await RegionModel.create(mockRegion(userId));

      const response = await request(server)
        .patch(`/api/regions/${region._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Name" });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("name", "Updated Name");
    });

    it("should return 401 without token", async () => {
      const region = await RegionModel.create(mockRegion(userId));

      const response = await request(server)
        .patch(`/api/regions/${region._id}`)
        .send({ name: "Updated Name" });

      expect(response.status).to.equal(401);
    });
  });

  describe("DELETE /api/regions/:id", () => {
    it("should return 401 when trying to delete other user region", async () => {
      const otherUser = await UserModel.create(mockUserWithAddress());
      const region = await RegionModel.create(mockRegion(otherUser._id));

      const response = await request(server)
        .delete(`/api/regions/${region._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(401);
    });
  });
});
