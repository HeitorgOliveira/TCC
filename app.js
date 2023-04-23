"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'AccessCityWeb'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'AccessCityWeb')));
app.get('/', (req, res) => {
    res.render("index.ejs");
});
app.post('/cadastro', (req, res) => {
    console.log("Got post request");
    res.render("index.ejs");
});
app.listen(port, () => {
    console.log(`Aqui: http://localhost:${port}`);
});
