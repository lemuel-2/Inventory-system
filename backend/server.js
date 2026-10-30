import "dotenv/config";
import express from "express";

import { ApiRoutes } from "./src/routes/api.route.js";
import { ErrorMiddleware } from "./src/middleware/error.middleware.js";
import { AppError } from "./src/utils/app-error.js";

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.configureMiddleware();
        this.registerRoutes();
        this.configureErrorHandling();
    }

    configureMiddleware() {
        this.app.use(express.json({ limit: "1mb" }));
    }

    registerRoutes() {
        const apiRoutes = new ApiRoutes();

        this.app.use("/api", apiRoutes.getRouter());

        this.app.use((req, res, next) => {
            next(
                new AppError(`Route not found ${req.method} ${req.originalUrl}`, 404)
            );
        })
    }

    configureErrorHandling() {
        const errorMiddleware = new ErrorMiddleware();

        this.app.use(errorMiddleware.handle);
    }

    start() {
        return this.app.listen(this.port, () => {
            console.log(
                `Server running at http://localhost:${this.port}`
            );
        });
    }
}

const server = new Server();

server.start();