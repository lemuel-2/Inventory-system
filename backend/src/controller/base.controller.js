import { AppError } from "../utils/app-error.js";

export class BaseController{
    execute(res, next, statusCode, operation) {
        try {
            const data = operation();

            return res.status(statusCode).json({ success: true, data });
        } catch (error) {
            return next(error)
        }
    }

    parseId(value, field = "ID") {
        const id = Number(value);

        if (value === undefined ||
            value === null || 
            String(value).trim() === "" ||
            !Number.isSafeInteger(id) ||
            id <= 0
        
        ) {
            throw new AppError(
                `${field} must be a positive integer`, 400
            )
        }

        return id;
    }

    parseQueryInteger(value, {field, defaultValue, min = 0, max = Number.MAX_SAFE_INTEGER}) {
        if (value === undefined) return defaultValue;

        const number = Number(value);

        if (String(value).trim() === "" ||
            !Number.isSafeInteger(number) ||
            number < min ||
            number > max
        ) {
            throw new AppError(
                `${field} must be an integer between ${min} and ${max}`, 400
            )
        }

        return number;
    }
}