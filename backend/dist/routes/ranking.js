"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rankingController_1 = require("../controllers/rankingController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.get('/board', rankingController_1.getRankingBoard);
router.get('/my', authMiddleware_1.default, rankingController_1.getMyRanking);
exports.default = router;
