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
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const app = (0, express_1.default)();
const port = 3000;
const numSalt = 12;
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
                const queue = `SELECT senha FROM AC_Usuario WHERE usuario = ?`;
                const values = [this.nome];
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
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'Web'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'Web')));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
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
    console.log("Got post request");
    const user = req.body.user;
    const date = req.body.date;
    const email = req.body.email;
    const tel = req.body.tel;
    const deficiencia = req.body.deficiencia;
    const password = req.body.password;
    let usuario = new Usuario(user, date, email, tel, deficiencia, password);
    let resultado = yield usuario.cadastrar();
    res.render('index.ejs');
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const password = req.body.password;
    let usuario = new Usuario(user, "", "", "", [], password);
    let resultado = yield usuario.login();
    if (resultado) {
        const foo = { id: uuidv4(), name: user, role: 'user' };
        const token = jwt.sign(foo, 'secret');
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
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
