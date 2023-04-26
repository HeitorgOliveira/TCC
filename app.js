"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const bcrypt = require('bcrypt');
const app = (0, express_1.default)();
const port = 3000;
const numSalt = 12;
class Usuario {
    constructor(nome, datanasc, email, celular, deficiencia, senha) {
        this.nome = nome;
        this.datanasc = datanasc;
        this.email = email;
        this.celular = celular;
        this.deficiencia = deficiencia;
        this.senha = bcrypt.hashSync(senha, numSalt);
    }
    cadastrar(nome, datanasc, email, celular, deficiencia, senha) {
        //TODO: Terminar o código para cadastrar o usuário
        console.log("Cadastrado com sucesso");
        return false;
    }
}
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
