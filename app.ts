import path from "path";
import express, { Request, Response, request } from 'express';
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const app = express();
const port = 3000;

const numSalt = 12;

var con = mysql.createConnection({
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
        this.senha = bcrypt.hashSync(senha, numSalt);
    }
    //"INSERT INTO AC_Usuario (nome, datanasc, email, celular, deficiencia, senha) VALUES (?, ?, ?, ?, ?, ?)",

    async cadastrar(): Promise<boolean>{
        try {
            con.connect((err : any) =>{
                if(err) throw err;
                console.log("Conectou");
                var sql = `INSERT INTO AC_Usuario (usuario, datanasc, email, celular, deficiencias, senha) VALUES ('${this.nome}', '${this.datanasc}', '${this.email}', '${this.celular}', '${this.deficiencia}', '${this.senha}')`;
                con.query(sql, (err : any, result: any) =>{
                    if (err) throw err;
                    console.log("1 dado modificado: ", result)
                })
            })
          return true;
        } catch (err) {
          console.error(`ERRO: ${err}`);
          return false;
        }
      }
      
      
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Web'));

app.use(express.static(path.join(__dirname, 'Web')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', (req: Request, res: Response) => {
    res.render("index.ejs");
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

    if(resultado){
        res.cookie('cadastro', true);
        res.render('index.ejs')
    }
    else{
        res.cookie('cadastro', false);
        res.render('index.ejs')
    }
    console.log(usuario);
})

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});