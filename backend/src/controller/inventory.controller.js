import { BaseController } from "./base.controller.js";
import { InventoryService} from "../services/inventory.service.js"

export class InventoryController extends BaseController {
    constructor({ inventoryService = new InventoryService() } = {}) {
        super();

        this.inventoryService = inventoryService;

        this.getStock = this.getStock.bind(this);
        this.stockIn = this.stockIn.bind(this);
        this.stockOut = this.stockOut.bind(this);
        this.adjustStock = this.adjustStock.bind(this);
        this.getMovementHistory = this.getMovementHistory.bind(this);
    }

    getStock(req, res, next) {
        return this.execute(
            res, next, 200, () => this.inventoryService.getStock(
                this.parseId(req.params.productId, "Product ID")
            )
        );
    }

    stockIn(req, res, next) {
        return this.execute(
            res, next, 200, () => this.inventoryService.stockIn(
                this.parseId(req.params.productId, "Product ID"),
                req.body?.quantity,
                req.body?.reason ?? null
            )
        );
    }

    stockOut(req, res, next) {
        return this.execute(
            res, next, 200, () => this.inventoryService.stockOut(
                this.parseId(req.params.productId, "Product Id"),
                req.body?.quantity,
                req.body?.reason ?? null
            )
        );
    }

    adjustStock(req, res, next) {
        return this.execute(
            res, next, 200, () => this.inventoryService.adjustStock(
                this.parseId(req.params.productId, "Product ID"),
                req.body?.quantityChange,
                req.body?.reason ?? null
            )
        );
    }

    getMovementHistory(req, res, next) {
        return this.execute(
            res, next, 200, () => {
            const productId = this.parseId(req.params.productId, "Product ID")
            const limit = this.parseQueryInteger(
                req.query.limit, {
                    field: "limit",
                    defaultValue: 50,
                    min: 1,
                    max: 100,
                }
            );

            const offset = this.parseQueryInteger(
                req.query.offset, {
                    field: "offset",
                    defaultValue: 0,
                    min: 0
                }
            )

            return this.inventoryService.getMovementHistory(productId, {limit, offset});
            }
        );
    }


}