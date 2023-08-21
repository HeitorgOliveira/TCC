import path from "path";
import express, { Request, Response, request } from 'express';
import { differenceInYears } from 'date-fns';
import jwt from 'jsonwebtoken';
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
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
            const queue = `SELECT * FROM AC_Usuario WHERE email = ?`;
            const values = [this.email];
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

app.get('mudarsenha', (req: Request, res: Response ) =>{
    //Veja se o usuário está logado, caso contrário envie-no de volta à página inicial com uma mensagem de erro

    res.render("mudarsenha.ejs");
});

app.post('/cadastro', async (req: Request, res: Response) =>{
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
    const diffInYears = differenceInYears(new Date(), idade);

    if ((diffInYears < 18) || (diffInYears > 120)){
        console.error("Idade inválida");
        res.render('index.ejs');
        return;
    }
    } catch (err) {
    console.error(err);
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = req.body.email;
    if (!regexEmail.test(email))
    {
        console.error("E-mail inválido");
        res.render('index.ejs');
        return
    }
    const regexTelefone = /^\d{2} \d{5}-\d{4}$/;
    const tel = req.body.tel;
    if (!regexTelefone.test(tel))
    {
        console.error("Telefone inválido");
        res.render('index.ejs');
        return
    }
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
    // validar cookie de sessão
    if (resultado)
    {
        res.render('index.ejs');
    }    
});



//TODO: mudar a senha

/*
    Para mudar a senha é necessário realizar uma série de etapas:
    1- Quando se usa o recurso de alterar a senha, é necessário que o usuário esteja logado.
    2- Depois é eviado um link para alterar a senha pelo e-mail do usuário. Nisso é util o sistema usado para verificar se o usuário está logado, pois assim é possivel armazenar seu E-mail
    3- O e-mail terá um link que levará o usuário para uma ágina de nosso domínio, onde ele há de escrever sua nova senha.
    4- Alterar no banco de dados a nova senha
*/



app.post('/login', async (req: Request, res: Response) =>{
    const email = req.body.email;
    const password = req.body.password;
    let usuario = new Usuario("", "", email, "", [], password);
    let resultado = await usuario.login();
    console.log(resultado);

    if(resultado){
        const user = { email: email, senha: password }
        //const token = jwt.sign(user, )
        res.render('index.ejs');
        console.log(`Login realizado com sucesso!!`);
    }
    else{
        res.cookie('login', false);
        res.render('index.ejs');
    }
});

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});
