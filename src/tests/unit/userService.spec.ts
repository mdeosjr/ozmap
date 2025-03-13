/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { UserRepository } from "../../repositories/userRepository";
import { UserService } from "../../services/userService";
import { AppError, STATUS_CODE } from "../../errors/AppError";
import {
  generateMockUserWithId,
  mockUserWithAddress,
} from "../mocks/userMocks";

chai.use(sinonChai);

describe("UserService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      const userData = mockUserWithAddress();
      const createdUser = generateMockUserWithId();

      sandbox.stub(UserRepository, "findByEmail").resolves(null);
      sandbox.stub(UserRepository, "create").resolves(createdUser);

      const result = await UserService.create(userData);

      expect(result).to.deep.equal(createdUser);
      expect(UserRepository.findByEmail).to.have.been.calledWith(
        userData.email,
      );
      expect(UserRepository.create).to.have.been.called;
    });

    it("should throw an error if user with email already exists", async () => {
      const userData = mockUserWithAddress();
      const existingUser = generateMockUserWithId();

      sandbox.stub(UserRepository, "findByEmail").resolves(existingUser);

      try {
        await UserService.create(userData);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.CONFLICT);
        expect(error.message).to.equal("User already exists");
      }
    });
  });

  describe("findAll", () => {
    it("should return users and total count", async () => {
      const mockUsers = [generateMockUserWithId(), generateMockUserWithId()];
      const total = mockUsers.length;

      sandbox
        .stub(UserRepository, "findAll")
        .resolves({ users: mockUsers, total });

      const result = await UserService.findAll(1, 10);

      expect(result).to.deep.equal({ users: mockUsers, total });
      expect(UserRepository.findAll).to.have.been.calledWith(0, 10);
    });

    it("should throw an error if no users found", async () => {
      sandbox.stub(UserRepository, "findAll").resolves({ users: [], total: 0 });

      try {
        await UserService.findAll(1, 10);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("No users found");
      }
    });
  });

  describe("findById", () => {
    it("should return user by ID", async () => {
      const mockUser = generateMockUserWithId();

      sandbox.stub(UserRepository, "findById").resolves(mockUser);

      const result = await UserService.findById(mockUser._id);

      expect(result).to.deep.equal(mockUser);
      expect(UserRepository.findById).to.have.been.calledWith(mockUser._id);
    });

    it("should throw an error if user not found", async () => {
      const userId = "nonexistent-id";

      sandbox.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.findById(userId);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("User not found");
      }
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      const mockUser = generateMockUserWithId();
      const updateData = { name: "Updated Name" };

      sandbox.stub(UserRepository, "findById").resolves(mockUser);
      sandbox.stub(UserRepository, "update").resolves(mockUser);

      const result = await UserService.update(mockUser._id, updateData);

      expect(result).to.deep.equal(mockUser);
      expect(UserRepository.findById).to.have.been.calledWith(mockUser._id);
      expect(UserRepository.update).to.have.been.calledWith(
        mockUser._id,
        updateData,
      );
    });

    it("should throw an error if user not found", async () => {
      const userId = "nonexistent-id";
      const updateData = { name: "Updated Name" };

      sandbox.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.update(userId, updateData);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("User not found");
      }
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      const mockUser = generateMockUserWithId();

      sandbox.stub(UserRepository, "findById").resolves(mockUser);
      sandbox.stub(UserRepository, "delete").resolves();

      await UserService.delete(mockUser._id);

      expect(UserRepository.findById).to.have.been.calledWith(mockUser._id);
      expect(UserRepository.delete).to.have.been.calledWith(mockUser._id);
    });

    it("should throw an error if user not found", async () => {
      const userId = "nonexistent-id";

      sandbox.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.delete(userId);
        expect.fail("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.equal(STATUS_CODE.NOT_FOUND);
        expect(error.message).to.equal("User not found");
      }
    });
  });
});
