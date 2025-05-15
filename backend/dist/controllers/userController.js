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
exports.getMyMoney = exports.refillMoney = exports.updateUserInfo = exports.getUserStats = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                nickname: true,
                money: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            return;
        }
        const recentGames = yield prisma_1.default.gameLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                game: true,
                result: true,
                bet: true,
                earnings: true,
                createdAt: true,
            },
        });
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                money: user.money,
            },
            recentGames,
        });
    }
    catch (error) {
        res.status(500).json({ message: '사용자 정보 조회 실패' });
    }
});
exports.getUserStats = getUserStats;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { nickname, oldPassword, newPassword } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        return;
    }
    const updateData = {};
    if (nickname) {
        const exists = yield prisma_1.default.user.findFirst({ where: { nickname, NOT: { id: userId } } });
        if (exists) {
            res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
            return;
        }
        updateData.nickname = nickname;
    }
    if (newPassword) {
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: '기존 비밀번호가 일치하지 않습니다.' });
            return;
        }
        updateData.password = yield bcrypt_1.default.hash(newPassword, 10);
    }
    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: '수정할 정보가 없습니다.' });
        return;
    }
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: updateData,
    });
    res.status(200).json({ message: '정보가 성공적으로 수정되었습니다.' });
});
exports.updateUserInfo = updateUserInfo;
const refillMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: '사용자 없음' });
            return;
        }
        if (user.money > 0) {
            res.status(400).json({ message: '머니가 아직 남아 있습니다.' });
            return;
        }
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { money: 1000 },
        });
        res.status(200).json({ message: '머니가 충전되었습니다.' });
    }
    catch (err) {
        res.status(500).json({ message: '충전 실패' });
    }
});
exports.refillMoney = refillMoney;
const getMyMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { money: true },
        });
        if (!user) {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ money: user.money });
    }
    catch (error) {
        res.status(500).json({ message: '금액 조회 실패' });
    }
});
exports.getMyMoney = getMyMoney;
