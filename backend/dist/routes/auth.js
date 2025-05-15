"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/login', authController_1.login);
router.post('/signup', authController_1.signup);
router.post('/reset-password', authController_1.resetPassword);
router.post('/verify-password', authMiddleware_1.default, authController_1.verifyPassword);
router.get('/check-username', authController_1.checkUsername);
router.get('/check-nickname', authController_1.checkNickname);
exports.default = router;
