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
const app = (0, express_1.default)();
const port = 3000;
const numSalt = 12;
const pool = mysql.createPool({
    host: "143.106.241.3",
    user: "cl201174",
    password: "essaehumasenha!",
    database: "cl201174",
});
app.use(session({
    name: "session",
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        httpOnly: true,
        path: "/",
    }
}));
class Usuario {
    constructor(nome, datanasc, email, celular, deficiencia, senha) {
        this.nome = nome;
        this.datanasc = datanasc;
        this.email = email;
        this.celular = celular;
        this.deficiencia = deficiencia;
        this.senha = bcrypt.hashSync(senha, numSalt);
    }
    cadastrar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield pool.getConnection();
                console.log(connection);
                const resultado = yield connection.execute("INSERT INTO AC_Usuario (nome, datanasc, email, celular, deficiencia, senha) VALUES (?, ?, ?, ?, ?, ?)", [this.nome, this.datanasc, this.email, this.celular, this.deficiencia, this.senha]);
                connection.release();
                if (resultado.affectedRows === 1) {
                    console.log(`AEEEE CADASTREI O ${this.nome}`);
                    return true;
                }
                return false;
            }
            catch (err) {
                console.error(`ERRO: ${err}`);
                return false;
            }
        });
    }
}
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'AccessCityWeb'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'AccessCityWeb')));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.render("index.ejs");
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
    if (resultado) {
        res.cookie('cadastro', true);
        res.render('index.ejs');
    }
    else {
        res.cookie('cadastro', false);
        res.render('index.ejs');
    }
    console.log(usuario);
}));
app.listen(port, () => {
    console.log(`Aqui: http://localhost:${port}`);
});
