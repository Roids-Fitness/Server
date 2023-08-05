// const request = require("supertest");
// const { app } = require("../server");
// const { createToken, verifyToken, handleError, checkForTimeOverlap, parseAndValidateDate } = require('../services');
// const jwt = require('jsonwebtoken');
// const moment = require('moment-timezone');
// const Class = require('../models/class');
// jest.mock('jsonwebtoken');
// jest.mock('../models/class');

// describe('JWT Service Tests', () => {
//     it('should create a token and verify it successfully', () => {
//         const userId = '123456';
//         const token = createToken(userId);

//         jwt.verify.mockReturnValueOnce({ user_id: userId });

//         expect(verifyToken(token).user_id).toBe(userId);
//     });

//     it('should throw an error for invalid token', () => {
//         jwt.verify.mockImplementationOnce(() => {
//             throw new Error('Invalid token');
//         });

//         expect(() => verifyToken('invalidToken')).toThrow('Invalid token');
//     });
// });

// describe('Error Handling', () => {
//     // Mock a response object
//     const mockResponse = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//     };

//     it('should handle errors correctly', () => {
//         const error = new Error('Test Error');
//         handleError(error, mockResponse);

//         expect(mockResponse.status).toHaveBeenCalledWith(500);
//         expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
//     });
// });

// describe('Time Overlap Checks', () => {
//     it('should detect overlapping class times', async () => {
//         const startTime = new Date();
//         const endTime = new Date(startTime.getTime() + 1000 * 60 * 60);  // 1 hour later

//         Class.findOne.mockResolvedValueOnce(true);

//         expect(await checkForTimeOverlap(startTime, endTime)).toBe(true);
//     });

//     it('should not detect overlapping class times if none overlap', async () => {
//         const startTime = new Date();
//         const endTime = new Date(startTime.getTime() + 1000 * 60 * 60);  // 1 hour later

//         Class.findOne.mockResolvedValueOnce(null);

//         expect(await checkForTimeOverlap(startTime, endTime)).toBe(false);
//     });
// });

// describe('Date Parsing and Validation', () => {
//     it('should correctly parse and validate dates', () => {
//         const dateStr = '2023-08-01T08:30:00';
//         const timezone = 'America/New_York';

//         const parsedDate = parseAndValidateDate(dateStr, 'start time', timezone);

//         expect(parsedDate).toEqual(moment.tz(dateStr, timezone).toDate());
//     });

//     it('should throw an error for invalid date strings', () => {
//         const dateStr = 'Invalid-Date';
//         const timezone = 'America/New_York';

//         expect(() => parseAndValidateDate(dateStr, 'start time', timezone)).toThrow('Invalid start time format');
//     });
// });
