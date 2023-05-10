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
    name: "sessao",
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
            con.connect((err : any) =>{
                if(err) throw err;
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


    //TODO: terminar login - falta conseguir comparar as senhas, do hash com a enviada pelo usuario
    // isso seria feito por meio de uma consulta que retornaria o hash do usuario e usaria depois o método 'bcrypt.compare' para comparar as senhas e ver se bate 
    async login(): Promise<boolean>{
        try {
            con.connect((err : any) =>{
                if(err) throw err;
                var sql_1 = `SELECT senha FROM AC_Usuario WHERE usuario = '123'`;
                con.query(sql_1, (err: any, result: any) =>{
                    console.log(`Resultado para encontrar a senha: ${result}\n`);
                    
                })
                //var sql = `SELECT * FROM AC_Usuario WHERE usuario = '${this.nome}' AND senha = '${this.senha}'`;
                var sql_2 = `SELECT * FROM AC_Usuario WHERE usuario = '123' AND senha = '${this.senha}'`;
                con.query(sql_2, (err: any, result: any) =>{
                    if (err) throw err;
                    if ((result.length < 1))
                    {
                        console.log("Não foi possível encontrar nada no banco :'(");
                    }
                    else{
                        console.log(`Login efetuado com sucesso!!\n\nNome: ${this.nome}\nSenha: ${this.senha}`)
                    }
                })
                return false;       
            })
        } catch (err) {
            return false;
        }
        return false;
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
})

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});

let flavin = new Usuario('flavin do pneu', '9999', '123', 'eee', [], '123');
flavin.login()

