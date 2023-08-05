const {
	validateRequest,
	validateAdmin,
} = require("../middlewares/auth_middleware");
const { verifyToken } = require("../services/auth_service");
const User = require("../models/user");

jest.mock("../services/auth_service");
jest.mock("../models/user");

let mockRequest;
let mockResponse;
let mockNext;

beforeEach(() => {
	mockRequest = {
		headers: {},
		user: {},
	};
	mockResponse = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};
	mockNext = jest.fn();
});

describe("validateRequest middleware", () => {
	it("should return 401 if no authorization header is provided", async () => {
		await validateRequest(mockRequest, mockResponse, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Not authenticated for this action. Please provide valid token",
		});
	});

	it("should return 401 if token is not present in header", async () => {
		mockRequest.headers.authorization = "Bearer ";
		await validateRequest(mockRequest, mockResponse, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "A token is required for authentication",
		});
	});

	it("should set user in request if token is valid", async () => {
		mockRequest.headers.authorization = "Bearer test_token";
		verifyToken.mockResolvedValueOnce({ id: "123" });

		await validateRequest(mockRequest, mockResponse, mockNext);

		expect(mockRequest.user).toEqual({ id: "123" });
		expect(mockNext).toHaveBeenCalled();
	});

	it("should return 401 if token is invalid", async () => {
		mockRequest.headers.authorization = "Bearer test_token";
		verifyToken.mockRejectedValueOnce({ name: "JsonWebTokenError" });

		await validateRequest(mockRequest, mockResponse, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Invalid token. Please provide a valid token for authentication.",
		});
	});
});

describe("validateAdmin middleware", () => {
	it("should proceed if user is admin", async () => {
		mockRequest.user.user_id = "123";
		User.findById.mockResolvedValueOnce({ isAdmin: true });

		await validateAdmin(mockRequest, mockResponse, mockNext);

		expect(mockNext).toHaveBeenCalled();
	});

	it("should return 403 if user is not admin", async () => {
		mockRequest.user.user_id = "123";
		User.findById.mockResolvedValueOnce({ isAdmin: false });

		await validateAdmin(mockRequest, mockResponse, mockNext);

		expect(mockResponse.status).toHaveBeenCalledWith(403);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Not authorized. User is not an admin",
		});
	});

	it("should call next with error if an error occurs while checking", async () => {
		mockRequest.user.user_id = "123";
		User.findById.mockRejectedValueOnce(new Error("Database Error"));

		await validateAdmin(mockRequest, mockResponse, mockNext);

		expect(mockNext).toHaveBeenCalledWith(new Error("Database Error"));
	});
});
