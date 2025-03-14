/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import sinon from "sinon";
import { UserService } from "../../services/userService";
import { UserRepository } from "../../repositories/userRepository";
import { User } from "../../models/userModel";
import { CreateUserInput } from "../../types/userTypes";
import {
  generateMockUserWithId,
  mockUserWithAddress,
} from "../mocks/userMocks";

describe("UserService Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should create user successfully", async () => {
      const userData = mockUserWithAddress();
      sinon.stub(UserRepository, "findByEmail").resolves(null);
      sinon.stub(UserRepository, "create").resolves(userData as User);

      const result = await UserService.create(userData as any);

      expect(result).to.deep.equal(userData);
    });

    it("should throw error if user already exists", async () => {
      const userData = mockUserWithAddress();
      sinon.stub(UserRepository, "findByEmail").resolves(userData as User);

      try {
        await UserService.create(userData as CreateUserInput);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("User already exists");
      }
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const user = mockUserWithAddress();
      const updateData = { name: "New Name" };

      sinon.stub(UserRepository, "findById").resolves(user as User);
      sinon
        .stub(UserRepository, "update")
        .resolves({ ...user, ...updateData } as User);

      const result = await UserService.update("userId", updateData);

      expect(result).to.have.property("name", updateData.name);
    });

    it("should throw error when user is not found", async () => {
      const updateData = { name: "New Name" };

      sinon.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.update("userId", updateData);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }
    });
  });

  describe("findAll", () => {
    it("should return users list and total", async () => {
      const users = [mockUserWithAddress(), mockUserWithAddress()];
      sinon
        .stub(UserRepository, "findAll")
        .resolves({ users: users as User[], total: 2 });

      const result = await UserService.findAll(1, 10);

      expect(result.users).to.have.length(2);
      expect(result.total).to.equal(2);
    });

    it("should throw error when no users found", async () => {
      sinon.stub(UserRepository, "findAll").resolves({ users: [], total: 0 });

      try {
        await UserService.findAll(1, 10);
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("No users found");
      }
    });
  });

  describe("findById", () => {
    it("should return user by id", async () => {
      const user = generateMockUserWithId();

      sinon.stub(UserRepository, "findById").resolves(user as User);

      const result = await UserService.findById(user._id);

      expect(result).to.deep.equal(user);
    });

    it("should throw error when user not found", async () => {
      sinon.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.findById("userId");
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      const user = generateMockUserWithId();
      const deleteStub = sinon.stub(UserRepository, "delete").resolves();
      sinon.stub(UserRepository, "findById").resolves(user as User);

      await UserService.delete(user._id);

      expect(deleteStub).to.have.been.calledOnce;
    });

    it("should throw error when user not found", async () => {
      sinon.stub(UserRepository, "findById").resolves(null);

      try {
        await UserService.delete("userId");
        expect.fail("Should throw error");
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }
    });
  });
});
