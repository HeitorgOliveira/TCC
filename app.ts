import path from "path";
import express, { Request, Response, request } from 'express';
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const numSalt = 12;


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

        public cadastrar(nome: string, datanasc: string, email: string, celular: string, deficiencia: [], senha: string): boolean
        {
            //TODO: Terminar o código para cadastrar o usuário
            console.log("Cadastrado com sucesso");
            return false;
        }

    }

}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AccessCityWeb'));
app.use(express.static(path.join(__dirname, 'AccessCityWeb')));


app.get('/', (req: Request, res: Response) => {
    res.render("index.ejs");
});

app.post('/cadastro', (req: Request, res: Response) =>{
    console.log("Got post request");
    res.render("index.ejs");
})

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});