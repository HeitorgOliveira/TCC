import path from "path";
import express, { Request, Response, request } from 'express';
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AccessCityWeb'));
app.use(express.static(path.join(__dirname, 'AccessCityWeb')));


app.get('/', (req: Request, res: Response) =>{
    res.render("index.ejs");
});

app.post('/cadastro', (req: Request, res: Response) =>{
    console.log("Got post request");
    res.render("index.ejs");
})

app.listen(port, ()=>{
    console.log(`Aqui: http://localhost:${port}`);
});