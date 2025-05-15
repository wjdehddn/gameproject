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
exports.getMyRanking = exports.getRankingBoard = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getRankingBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            orderBy: { money: 'desc' },
            take: 10,
            select: {
                id: true,
                username: true,
                nickname: true,
                money: true,
            },
        });
        res.status(200).json({ rankings: users });
    }
    catch (err) {
        res.status(500).json({ message: '서버 오류' });
    }
});
exports.getRankingBoard = getRankingBoard;
const getMyRanking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const allUsers = yield prisma_1.default.user.findMany({
            orderBy: { money: 'desc' },
            select: { id: true },
        });
        const rank = allUsers.findIndex((u) => u.id === userId) + 1;
        if (!rank) {
            res.status(404).json({ message: '랭킹을 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ rank });
    }
    catch (err) {
        res.status(500).json({ message: '서버 오류' });
    }
});
exports.getMyRanking = getMyRanking;
