"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["api-key"];
    if (!apiKey) {
        res.status(401).json({ message: "API Key não fornecida" });
        return;
    }
    const expectedApiKey = process.env.TECHPATH_API_KEY;
    if (apiKey !== expectedApiKey) {
        res.status(403).json({ message: "API Key inválida" });
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
