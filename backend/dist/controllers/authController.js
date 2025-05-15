"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNickname = exports.checkUsername = exports.verifyPassword = exports.resetPassword = exports.signup = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { username } });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({
        token,
        user: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            money: user.money,
        },
    });
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, nickname } = req.body;
    const exists = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ username }, { nickname }],
        },
    });
    if (exists) {
        res.status(400).json({ message: '이미 사용 중인 아이디 또는 닉네임입니다.' });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
        data: { username, password: hashedPassword, nickname },
    });
    res.status(201).json({ message: '회원가입 성공', userId: user.id });
});
exports.signup = signup;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, nickname, newPassword } = req.body;
    const user = yield prisma_1.default.user.findFirst({
        where: { username, nickname },
    });
    if (!user) {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        return;
    }
    const hashed = yield bcrypt_1.default.hash(newPassword, 10);
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { password: hashed },
    });
    res.status(200).json({ message: '비밀번호가 재설정되었습니다.' });
});
exports.resetPassword = resetPassword;
const verifyPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { password } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ valid: false });
        return;
    }
    const isValid = yield bcrypt_1.default.compare(password, user.password);
    res.status(200).json({ valid: isValid });
});
exports.verifyPassword = verifyPassword;
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.query;
    const user = yield prisma_1.default.user.findUnique({ where: { username: String(username) } });
    res.status(200).json({ isAvailable: !user });
});
exports.checkUsername = checkUsername;
const checkNickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname } = req.query;
    const user = yield prisma_1.default.user.findFirst({ where: { nickname: String(nickname) } });
    res.status(200).json({ isAvailable: !user });
});
exports.checkNickname = checkNickname;
