import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import { AuthService } from "../../services/authService";
import { UserRepository } from "../../repositories/userRepository";
import { mockUserWithAddress } from "../mocks/userMocks";

describe("AuthService Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("login", () => {
    it("should return token for valid credentials", async () => {
      const password = "test123";
      const user = mockUserWithAddress();
      user.password = await bcrypt.hash(password, 8);

      sinon.stub(UserRepository, "findByEmail").resolves(user as any);

      const token = await AuthService.login({
        email: user.email,
        password,
      });

      expect(token).to.be.a("string");
    });

    it("should throw error for invalid credentials", async () => {
      sinon.stub(UserRepository, "findByEmail").resolves(null);

      try {
        await AuthService.login({
          email: "invalid@email.com",
          password: "wrongpass",
        });
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("Invalid credentials");
      }
    });
  });
});
