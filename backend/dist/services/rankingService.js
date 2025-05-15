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
exports.updateRanking = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const updateRanking = (userId, earnings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield prisma_1.default.ranking.findFirst({ where: { userId } });
        if (!existing || earnings > existing.score) {
            yield prisma_1.default.ranking.upsert({
                where: { id: (existing === null || existing === void 0 ? void 0 : existing.id) || 0 },
                update: { score: earnings },
                create: { userId, score: earnings },
            });
        }
    }
    catch (err) {
        console.error('랭킹 업데이트 실패:', err);
    }
});
exports.updateRanking = updateRanking;
