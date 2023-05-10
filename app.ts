import path from "path";
import express, { Request, Response, request } from 'express';
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const app = express();
const port = 3000;

const numSalt = 12;

app.use(session({
    name: "sessao",
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        httpOnly: true,
        path: "/",
    }
}));



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
    deficiencia: [];
    senha: string;

    constructor(nome: string, datanasc: string, email: string, celular: string, deficiencia: [], senha: string)
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
                    console.log(`Login realizado com sucesso!!`);
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Web'));

app.use(express.static(path.join(__dirname, 'Web')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', (req: Request, res: Response) => {
    res.render("index.ejs");
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
    const deficiencia = req.body.deficiencia;
    const password = req.body.password;
    let usuario = new Usuario(user, date, email, tel, deficiencia, password);
    let resultado = await usuario.cadastrar();
    res.render('index.ejs');
    /*if(resultado){
        res.cookie('cadastro', true);
        res.render('index.ejs')
    }
    else{
        res.cookie('cadastro', false);
        res.render('index.ejs')
    }*/
});

app.post('/login', async (req: Request, res: Response) =>{
    const user = req.body.user;
    const password = req.body.password;
    let usuario = new Usuario(user, "", "", "", [], password);
    let resultado = await usuario.login();

    if(resultado){
        res.cookie('login', true);
        res.render('index.ejs')
    }
    else{
        res.cookie('login', false);
        res.render('index.ejs')
    }
});

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});


