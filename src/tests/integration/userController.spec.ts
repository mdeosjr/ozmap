/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import request from "supertest";
import server from "../../index";
import { UserModel } from "../../models/userModel";
import jwt from "jsonwebtoken";
import { mockUserWithAddress } from "../mocks/userMocks";

describe("UserController Integration Tests", () => {
  let token: string;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    const user = await UserModel.create(mockUserWithAddress());
    token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
    );
  });

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const response = await request(server)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(Array.isArray(response.body.rows)).to.be.true;
      expect(response.body.rows).to.have.length(1);
      expect(response.body.total).to.equal(1);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = mockUserWithAddress();
      const response = await request(server).post("/api/users").send(userData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("name", userData.name);
    });

    it("should return 409 when email already exists", async () => {
      const existingUser = mockUserWithAddress();
      await UserModel.create(existingUser);

      const response = await request(server)
        .post("/api/users")
        .send(existingUser);

      expect(response.status).to.equal(409);
    });

    it("should return 422 when both address and coordinates are provided", async () => {
      const userData = {
        ...mockUserWithAddress(),
        coordinates: [10, 10],
      };

      const response = await request(server).post("/api/users").send(userData);

      expect(response.status).to.equal(422);
    });
  });

  describe("GET /api/users/me", () => {
    it("should get authenticated user profile", async () => {
      const response = await request(server)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("email");
    });
  });

  describe("PATCH /api/users/me", () => {
    it("should update user successfully", async () => {
      const updateData = { name: "New Name" };

      const response = await request(server)
        .patch("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal(updateData.name);
    });

    it("should return 401 without token", async () => {
      const response = await request(server)
        .patch("/api/users/me")
        .send({ name: "New Name" });

      expect(response.status).to.equal(401);
    });
  });

  describe("DELETE /api/users/me", () => {
    it("should delete user successfully", async () => {
      const response = await request(server)
        .delete("/api/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(204);
    });

    it("should return 401 without token", async () => {
      const response = await request(server).delete("/api/users/me");

      expect(response.status).to.equal(401);
    });
  });
});
