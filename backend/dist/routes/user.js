"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.get('/mypage', authMiddleware_1.default, userController_1.getUserStats);
router.get('/money', authMiddleware_1.default, userController_1.getMyMoney); // 💡 추가된 부분
router.patch('/update', authMiddleware_1.default, userController_1.updateUserInfo);
router.post('/refill', authMiddleware_1.default, userController_1.refillMoney);
exports.default = router;
