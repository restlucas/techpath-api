"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler = {
    success(res, message, data) {
        res.status(200).json({ success: true, message, data });
    },
    created(res, message, data) {
        res.status(201).json({ success: true, message, data });
    },
    updated(res, message, data) {
        res.status(200).json({ success: true, message, data });
    },
    deleted(res, message) {
        res.status(200).json({ success: true, message });
    },
    error(res, status, message) {
        res.status(status).json({ success: false, message });
    },
};
exports.default = responseHandler;
