"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/rps', authMiddleware_1.default, gameController_1.playRPS);
router.post('/oddeven', authMiddleware_1.default, gameController_1.playOddEven);
router.post('/roulette', authMiddleware_1.default, gameController_1.playRoulette);
exports.default = router;
