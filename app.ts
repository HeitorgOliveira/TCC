import path from "path";
import express, { Request, Response, request } from 'express';
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('cookie-session');
const app = express();
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

    async cadastrar(): Promise<boolean>{
        try {
          const connection = await pool.getConnection();
          console.log(connection);
          const resultado = await connection.execute(
            "INSERT INTO AC_Usuario (nome, datanasc, email, celular, deficiencia, senha) VALUES (?, ?, ?, ?, ?, ?)",
            [this.nome, this.datanasc, this.email, this.celular, this.deficiencia, this.senha]
          );
          connection.release();
          if (resultado.affectedRows === 1) {
            console.log(`AEEEE CADASTREI O ${this.nome}`);
            return true;
          }
          return false;
        } catch (err) {
          console.error(`ERRO: ${err}`);
          return false;
        }
      }
      
      
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AccessCityWeb'));

app.use(express.static(path.join(__dirname, 'AccessCityWeb')));
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