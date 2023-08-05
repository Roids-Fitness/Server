// const request = require("supertest");
// const { app } = require("../server");
// const jwt = require('jsonwebtoken');
// const moment = require('moment-timezone');
// const Class = require('../models/class');
// jest.mock('jsonwebtoken');
// jest.mock('../models/class');
// const { validateRequest, validateAdmin } = require('../middlewares/auth_middleware');
// const User = require('../models/user');
// jest.mock('../models/user');
// jest.mock('../services/auth_service');

// describe('Auth Middleware', () => {
//     let mockRequest;
//     let mockResponse;
//     const nextFunction = jest.fn();

//     beforeEach(() => {
//         mockRequest = {
//             headers: {},
//             user: {}
//         };
//         mockResponse = {
//             status: jest.fn(function() {
//                 return this;
//             }),
//             json: jest.fn()
//         };
//     });

//     describe('validateRequest', () => {
//         it('should respond with 401 if authorization header is missing', async () => {
//             await validateRequest(mockRequest, mockResponse, nextFunction);
//             expect(mockResponse.status).toHaveBeenCalledWith(401);
//             expect(mockResponse.json).toHaveBeenCalledWith({
//                 error: "Not authenticated for this action. Please provide valid token"
//             });
//         });

//         it('should respond with 401 if token is missing from the header', async () => {
//             mockRequest.headers.authorization = 'Bearer ';
//             await validateRequest(mockRequest, mockResponse, nextFunction);
//             expect(mockResponse.status).toHaveBeenCalledWith(401);
//             expect(mockResponse.json).toHaveBeenCalledWith({
//                 error: "A token is required for authentication"
//             });
//         });

//         it('should proceed to next middleware if token is valid', async () => {
//             mockRequest.headers.authorization = 'Bearer validtoken';
//             require('../services/auth_service').verifyToken.mockResolvedValueOnce({ user_id: '1234' });
//             await validateRequest(mockRequest, mockResponse, nextFunction);
//             expect(nextFunction).toHaveBeenCalled();
//             expect(mockRequest.user.user_id).toBe('1234');
//         });
//     });

//     describe('validateAdmin', () => {
//         it('should respond with 403 if user is not an admin', async () => {
//             mockRequest.user.user_id = '1234';
//             User.findById.mockResolvedValueOnce({ isAdmin: false });
//             await validateAdmin(mockRequest, mockResponse, nextFunction);
//             expect(mockResponse.status).toHaveBeenCalledWith(403);
//             expect(mockResponse.json).toHaveBeenCalledWith({
//                 error: "Not authorized. User is not an admin"
//             });
//         });

//         it('should proceed to next middleware if user is an admin', async () => {
//             mockRequest.user.user_id = '1234';
//             User.findById.mockResolvedValueOnce({ isAdmin: true });
//             await validateAdmin(mockRequest, mockResponse, nextFunction);
//             expect(nextFunction).toHaveBeenCalled();
//         });
//     });
// });
