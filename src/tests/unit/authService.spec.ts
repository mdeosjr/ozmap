import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { UserRepository } from "../../repositories/userRepository";
import { AuthService } from "../../services/authService";
import { AppError, STATUS_CODE } from "../../errors/AppError";
import { generateMockUserWithId, mockHashedPassword } from "../mocks/userMocks";

chai.use(sinonChai);

describe("AuthService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const originalPassword = "Password123!";
      const mockUser = generateMockUserWithId();

      mockUser.password = mockHashedPassword(originalPassword);

      const loginData = {
        email: mockUser.email,
        password: originalPassword,
      };

      sandbox.stub(UserRepository, "findByEmail").resolves(mockUser);

      const token = await AuthService.login(loginData);

      expect(token).to.be.a("string").and.to.have.length.greaterThan(0);
      expect(UserRepository.findByEmail).to.have.been.calledWith(
        loginData.email,
      );
    });

    it("should throw an error for non-existent user", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "Password123!",
      };

      sandbox.stub(UserRepository, "findByEmail").resolves(null);

      try {
        await AuthService.login(loginData);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.UNAUTHORIZED);
        expect(error.message).to.equal("Invalid credentials");
      }
    });

    it("should throw an error for invalid password", async () => {
      const correctPassword = "CorrectPassword123!";
      const wrongPassword = "WrongPassword123!";

      const mockUser = generateMockUserWithId();
      mockUser.password = mockHashedPassword(correctPassword);

      const loginData = {
        email: mockUser.email,
        password: wrongPassword,
      };

      sandbox.stub(UserRepository, "findByEmail").resolves(mockUser);

      try {
        await AuthService.login(loginData);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.UNAUTHORIZED);
        expect(error.message).to.equal("Invalid credentials");
      }
    });
  });
});
