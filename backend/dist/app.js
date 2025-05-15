"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const game_1 = __importDefault(require("./routes/game"));
const ranking_1 = __importDefault(require("./routes/ranking"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/game', game_1.default);
app.use('/ranking', ranking_1.default);
exports.default = app;
