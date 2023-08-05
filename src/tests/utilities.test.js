const { handleError, checkForTimeOverlap, parseAndValidateDate } = require('../services/utilities');
const Class = require('../models/class');
const moment = require("moment-timezone");

jest.mock('../models/class');

let mockResponse;
let mockConsoleError;

beforeEach(() => {
    mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    mockConsoleError.mockRestore();
});

describe('Utilities', () => {
    describe('handleError', () => {
        it('should log error and send default response', () => {
            const error = new Error("Test Error");

            handleError(error, mockResponse);
            
            expect(mockConsoleError).toHaveBeenCalledWith(`Error while accessing data:\n${error}`);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });

        it('should send custom error message', () => {
            const error = new Error("Test Error");

            handleError(error, mockResponse, "Custom Error Message");
            
            expect(mockConsoleError).toHaveBeenCalledWith(`Error while accessing data:\n${error}`);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Custom Error Message" });
        });
    });

    describe('checkForTimeOverlap', () => {
        it('should return true if overlapping class is found', async () => {
            Class.findOne.mockResolvedValueOnce({});

            const result = await checkForTimeOverlap(new Date(), new Date());

            expect(result).toBe(true);
        });

        it('should return false if no overlapping class is found', async () => {
            Class.findOne.mockResolvedValueOnce(null);

            const result = await checkForTimeOverlap(new Date(), new Date());

            expect(result).toBe(false);
        });

        it('should throw an error if there is an issue checking for overlap', async () => {
            Class.findOne.mockRejectedValueOnce(new Error("Database Error"));

            await expect(checkForTimeOverlap(new Date(), new Date())).rejects.toThrow("Error while checking for class overlap");
        });
    });

    describe('parseAndValidateDate', () => {
        it('should return a valid date for a valid input', () => {
            const dateStr = "2023-08-01T08:30:00";
            const timezone = "UTC";

            const result = parseAndValidateDate(dateStr, "start time", timezone);
            const expectedDate = moment.tz(dateStr, timezone).toDate();

            expect(result).toEqual(expectedDate);
        });

        it('should throw an error for an invalid date input', () => {
            const dateStr = "InvalidDate";
            const timezone = "UTC";

            expect(() => parseAndValidateDate(dateStr, "start time", timezone)).toThrow("Invalid start time format. It must be a valid date. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00");
        });
    });
});
