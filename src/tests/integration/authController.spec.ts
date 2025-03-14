import { expect } from "chai";
import request from "supertest";
import server from "../../index";
import { UserModel } from "../../models/userModel";
import { mockHashedPassword, mockUserWithAddress } from "../mocks/userMocks";

describe("AuthController Integration Tests", () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const password = "test123";
      const hashedPassword = mockHashedPassword(password);
      const userData = mockUserWithAddress();
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
      });

      const response = await request(server).post("/api/auth/login").send({
        email: user.email,
        password: password,
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("token");
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(server)
        .post("/api/auth/login")
        .send({ email: "invalid@email.com", password: "wrongpass" });

      expect(response.status).to.equal(401);
    });
  });
});
