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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = 8080;
const db_controller_1 = require("./db.controller");
const dbCtrl = new db_controller_1.DbController();
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
app.get('/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield dbCtrl.query({ query: "select count(*) from tusg_content_421614_466" }));
}));
app.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield dbCtrl.query({ query: "select * from tusg_content_421614_466" }));
}));
app.post('/query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    res.send(yield dbCtrl.query(req.body));
}));
app.post('/create_table', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield dbCtrl.create_table(req.body));
}));
app.post('/mutate_table', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send(yield dbCtrl.mutate_table());
    }
    catch (err) {
        res.json(err);
    }
}));
app.post('/record', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        res.send(yield dbCtrl.write_record(req.body));
    }
    catch (err) {
        res.json(err);
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map