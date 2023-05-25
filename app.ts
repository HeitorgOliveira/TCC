import path from "path";
import express, { Request, Response, request } from 'express';
//import { v4 as uuidv4 } from 'uuid';
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const numSalt = 12;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Web'));

app.use(express.static(path.join(__dirname, 'Web')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


class Usuario {

    private con = mysql.createConnection({
        host: "143.106.241.3",
        user: "cl201174",
        password: "essaehumasenha!",
        database: "cl201174",
    });

    nome: string;
    datanasc: string;
    email: string;
    celular: string;
    deficiencia: string[];
    senha: string;

    constructor(nome: string, datanasc: string, email: string, celular: string, deficiencia: string[], senha: string)
    {
        this.nome = nome;
        this.datanasc = datanasc;
        this.email = email;
        this.celular = celular;
        this.deficiencia = deficiencia;
        this.senha = senha;
    }

    async cadastrar(): Promise<boolean>{
        try {
            var queue = `SELECT * FROM AC_Usuario WHERE email = ?`;
            var values = [this.email];
            var result = await this.execute(queue, values);
            var hash = bcrypt.hashSync(this.senha, numSalt);
            if (result.length == 0){
                queue = `INSERT INTO AC_Usuario (usuario, datanasc, email, celular, deficiencias, senha) VALUES (?, ?, ?, ?, ?, ?)`;
                values = [this.nome, this.datanasc, this.email, this.celular, this.deficiencia.toString(), hash];
                await this.execute(queue, values);
                console.log("1 dado modificado");
                return true;
            }
            else
            {
                console .log("Email já cadastrado");
                return false;
            }
        } catch (err) {
          console.error(`ERRO: ${err}`);
          return false;
        }
      }

    async login(): Promise<boolean>{
        try {
            const queue = `SELECT senha FROM AC_Usuario WHERE usuario = ?`;
            const values = [this.nome];
            const result = await this.execute(queue, values);
            if (result.length > 0){
                const dbhash = result[0].senha;
                const match = bcrypt.compareSync(this.senha, dbhash);
                if (match){
                    return true;
                }
            }
            console.log(`Login falhou`);
            return false;
        }catch (err) {
            console.error(`ERRO: ${err}`);
            return false;
        }
    }    

    private execute(sql: string, values: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.con.query(sql, values, (err: any, result: any) => {
                if (err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        }
    ,);}
}


app.get('/', (req: Request, res: Response) => {
    res.render("index.ejs");
});

app.get('/tela', (req: Request, res: Response) =>{
    res.render("tela.ejs");
});

app.get('/cadastro', (req: Request, res: Response) => {
    res.render("cadastro.ejs");
});

app.get('/login', (req: Request, res: Response) => {
    res.render("login.ejs");
});

app.get('/sobre', (req: Request, res: Response) => {
    res.render("sobre.ejs");
});

app.get('/contato', (req: Request, res: Response) => {
    res.render("contato.ejs");
});



app.post('/cadastro', async (req: Request, res: Response) =>{
    console.log("Got post request");
    const user = req.body.user;
    const date = req.body.date;
    const email = req.body.email;
    const tel = req.body.tel;
    const deficiencia = [];

    if (req.body.motora === 'on')
    {
        deficiencia.push('motora');
    }
    if (req.body.visual === 'on')
    {
        deficiencia.push('visual')
    }
    if (req.body.auditiva === 'on')
    {
        deficiencia.push('auditiva');
    }
    if (req.body.outros === 'on')
    {
        deficiencia.push('outro');
    }
    const password = req.body.password;
    let usuario = new Usuario(user, date, email, tel, deficiencia, password);
    let resultado = await usuario.cadastrar();
    res.render('index.ejs');
    
});

app.post('/login', async (req: Request, res: Response) =>{
    const user = req.body.user;
    const password = req.body.password;
    let usuario = new Usuario(user, "", "", "", [], password);
    let resultado = await usuario.login();

    if(resultado){/*
        const foo = {id: uuidv4(), name: user, role: 'user'};
        const token = jwt.sign(foo, 'secret');
        res.cookie(
            'token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });*/
        console.log(`Login realizado com sucesso!!`);
    }
    else{
        res.cookie('login', false);
        res.render('index.ejs')
    }
});

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});


