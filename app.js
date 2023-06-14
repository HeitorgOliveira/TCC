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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const date_fns_1 = require("date-fns");
//import { v4 as uuidv4 } from 'uuid';
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const jwt = require('jsonwebtoken');
const app = (0, express_1.default)();
const port = 3000;
const numSalt = 12;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'Web'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'Web')));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
class Usuario {
    constructor(nome, datanasc, email, celular, deficiencia, senha) {
        this.con = mysql.createConnection({
            host: "143.106.241.3",
            user: "cl201174",
            password: "essaehumasenha!",
            database: "cl201174",
        });
        this.nome = nome;
        this.datanasc = datanasc;
        this.email = email;
        this.celular = celular;
        this.deficiencia = deficiencia;
        this.senha = senha;
    }
    cadastrar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var queue = `SELECT * FROM AC_Usuario WHERE email = ?`;
                var values = [this.email];
                var result = yield this.execute(queue, values);
                var hash = bcrypt.hashSync(this.senha, numSalt);
                if (result.length == 0) {
                    queue = `INSERT INTO AC_Usuario (usuario, datanasc, email, celular, deficiencias, senha) VALUES (?, ?, ?, ?, ?, ?)`;
                    values = [this.nome, this.datanasc, this.email, this.celular, this.deficiencia.toString(), hash];
                    yield this.execute(queue, values);
                    console.log("1 dado modificado");
                    return true;
                }
                else {
                    console.log("Email já cadastrado");
                    return false;
                }
            }
            catch (err) {
                console.error(`ERRO: ${err}`);
                return false;
            }
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queue = `SELECT * FROM AC_Usuario WHERE email = ?`;
                const values = [this.email];
                const result = yield this.execute(queue, values);
                if (result.length > 0) {
                    const dbhash = result[0].senha;
                    const match = bcrypt.compareSync(this.senha, dbhash);
                    if (match) {
                        return true;
                    }
                }
                console.log(`Login falhou`);
                return false;
            }
            catch (err) {
                console.error(`ERRO: ${err}`);
                return false;
            }
        });
    }
    execute(sql, values) {
        return new Promise((resolve, reject) => {
            this.con.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
app.get('/', (req, res) => {
    res.render("index.ejs");
});
app.get('/tela', (req, res) => {
    res.render("tela.ejs");
});
app.get('/cadastro', (req, res) => {
    res.render("cadastro.ejs");
});
app.get('/login', (req, res) => {
    res.render("login.ejs");
});
app.get('/sobre', (req, res) => {
    res.render("sobre.ejs");
});
app.get('/contato', (req, res) => {
    res.render("contato.ejs");
});
app.post('/cadastro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const date = req.body.date;
    try {
        const idadeRegex = /^(\d{4})\-(\d{2})\-(\d{2})$/;
        if (!date.match(idadeRegex)) {
            console.error("Formato inválido para idade");
            res.render('index.ejs');
            return;
        }
        const [year, month, day] = date.split('-').map(Number);
        const idade = new Date(year, month - 1, day);
        const diffInYears = (0, date_fns_1.differenceInYears)(new Date(), idade);
        if ((diffInYears < 18) || (diffInYears > 120)) {
            console.error("Idade inválida");
            res.render('index.ejs');
            return;
        }
    }
    catch (err) {
        console.error(err);
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = req.body.email;
    if (!regexEmail.test(email)) {
        console.error("E-mail inválido");
        res.render('index.ejs');
        return;
    }
    const regexTelefone = /^\d{2} \d{5}-\d{4}$/;
    const tel = req.body.tel;
    if (!regexTelefone.test(tel)) {
        console.error("Telefone inválido");
        res.render('index.ejs');
        return;
    }
    const deficiencia = [];
    if (req.body.motora === 'on') {
        deficiencia.push('motora');
    }
    if (req.body.visual === 'on') {
        deficiencia.push('visual');
    }
    if (req.body.auditiva === 'on') {
        deficiencia.push('auditiva');
    }
    if (req.body.outros === 'on') {
        deficiencia.push('outro');
    }
    const password = req.body.password;
    let usuario = new Usuario(user, date, email, tel, deficiencia, password);
    let resultado = yield usuario.cadastrar();
    if (resultado) {
        res.render('index.ejs');
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    let usuario = new Usuario("", "", email, "", [], password);
    let resultado = yield usuario.login();
    if (resultado) { /*
        const foo = {id: uuidv4(), name: user, role: 'user'};
        const token = jwt.sign(foo, 'secret');
        res.cookie(
            'token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });*/
        res.render('index.ejs');
        console.log(`Login realizado com sucesso!!`);
    }
    else {
        res.cookie('login', false);
        res.render('index.ejs');
    }
}));
app.listen(port, () => {
    console.log(`Aqui: http://localhost:${port}`);
});
