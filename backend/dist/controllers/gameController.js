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
exports.playRoulette = exports.playOddEven = exports.playRPS = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const rankingService_1 = require("../services/rankingService");
const playRPS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { bet, userChoice } = req.body;
    if (!['rock', 'paper', 'scissors'].includes(userChoice) || typeof bet !== 'number' || bet <= 0) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: '사용자 없음' });
    if (user.money < bet)
        return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result;
    if (userChoice === computerChoice)
        result = 'draw';
    else if ((userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper'))
        result = 'win';
    else
        result = 'lose';
    const earnings = result === 'win' ? Math.floor(bet * 1.9) :
        result === 'draw' ? bet : 0;
    const gameLog = yield prisma_1.default.gameLog.create({
        data: { userId, game: 'RPS', result, bet, earnings },
    });
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { money: { increment: earnings - bet } },
    });
    yield (0, rankingService_1.updateRanking)(userId, earnings);
    res.status(200).json({ result, computerChoice, gameLog });
});
exports.playRPS = playRPS;
const playOddEven = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { bet, choice } = req.body;
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: '사용자 없음' });
    if (user.money < bet)
        return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2;
    const isEven = sum % 2 === 0;
    const result = (isEven && choice === 'even') || (!isEven && choice === 'odd') ? 'win' : 'lose';
    const earnings = result === 'win' ? Math.floor(bet * 1.9) : 0;
    const gameLog = yield prisma_1.default.gameLog.create({
        data: { userId, game: 'OddEven', bet, result, earnings },
    });
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { money: { increment: earnings - bet } },
    });
    yield (0, rankingService_1.updateRanking)(userId, earnings);
    res.status(200).json({ result, dice1, dice2, sum, gameLog });
});
exports.playOddEven = playOddEven;
const playRoulette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const bet = Number(req.body.bet);
    const selectedMultiplier = Number(req.body.selectedMultiplier);
    if (isNaN(bet) || isNaN(selectedMultiplier) || bet <= 0) {
        return res.status(400).json({ message: '잘못된 입력입니다.' });
    }
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ message: '사용자 없음' });
    if (user.money < bet)
        return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });
    const rouletteSlots = [
        { multiplier: 2, count: 10 },
        { multiplier: 3, count: 7 },
        { multiplier: 5, count: 4 },
        { multiplier: 10, count: 2 },
        { multiplier: 20, count: 1 },
    ];
    let board = [];
    rouletteSlots.forEach(slot => {
        for (let i = 0; i < slot.count; i++) {
            board.push(slot.multiplier);
        }
    });
    const randomIndex = Math.floor(Math.random() * board.length);
    const resultMultiplier = board[randomIndex];
    const result = resultMultiplier === selectedMultiplier ? 'win' : 'lose';
    const earnings = result === 'win' ? bet * selectedMultiplier : 0;
    const gameLog = yield prisma_1.default.gameLog.create({
        data: { userId, game: 'Roulette', bet, result, earnings },
    });
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { money: { increment: earnings - bet } },
    });
    yield (0, rankingService_1.updateRanking)(userId, earnings);
    res.status(200).json({ result, resultMultiplier, gameLog });
});
exports.playRoulette = playRoulette;
