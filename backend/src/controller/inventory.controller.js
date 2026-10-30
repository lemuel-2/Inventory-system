import { BaseController } from "./base.controller";
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
                res.body?.quantity,
                res.body?.reason ?? null
            )
        );
    }

    stockOut() {
        return this.execute(
            res, next, 200, () => this.inventoryService.stockOut(
                this.parseId(req.params.productId, "Product Id"),
                res.body?.quantity,
                res.body?.reason ?? null
            )
        );
    }

    adjustStock(req, res, next) {
        res, next, 200, () => this.inventoryService.adjustStock(
            this.parseId(req.params.productId, "Product ID"),
            res.body?.quantityChange,
            req.body?.reason ?? null
        );
    }

    getMovementHistory(req, res, next) {
        res, next, 200, () => {
            const productId = this.parseId(req.params.productId, "Product ID")
            const limit = this.parseQueryInteger(
                req.params.limit, {
                    field: "limit",
                    defaultValue: 50,
                    min: 1,
                    max: 100,
                }
            );

            const offset = this.parseQueryInteger(
                req.params.offset, {
                    field: "offset",
                    defaultValue: 0,
                    min: 0
                }
            )

            return this.inventoryService.getMovementHistory(productId, {limit, offset});
        }
    }


}