export class ErrorMiddleware {
    constructor({ logger = console } = {}) {
        this.logger = logger;
        this.handle = this.handle.bind(this);
    }

    handle(error, req, res, next) {
        if (res.headersSent) return next(error);

        const statusCode = Number.isInteger(error.statusCode) 
            ? error.statusCode 
            : 500;
        
        if (statusCode >= 500) this.logger.error(error);
        
        return res.status(statusCode).json({
            success: false,
            error: {
                message: statusCode >= 500 
                    ? "Internal server Error" 
                    : error.message
            }
        })
    }

}