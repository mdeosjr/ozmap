import "reflect-metadata";
import "./setup";

// import "./unit/authService.spec";
// import "./unit/userService.spec";
// import "./unit/regionService.spec";

import "./integration/auth.spec";
import "./integration/user.spec";
import "./integration/region.spec";

describe("All Tests", () => {
  it("should run all tests", () => {});
});
