from flask import Flask, request, render_template, url_for, session, flash, redirect
from flask_session import Session
from datetime import datetime
from functools import wraps
import re
import bcrypt
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
UPLOAD_FOLDER = "usuarios"

app = Flask(__name__)

#Em caso de falsa, a sessão será encerrada ao fechar o navegador
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = 'filesystem'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
Session(app)

def login_necessario(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Você não tem acesso a esta página", "error")
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function

@app.template_filter('url_for_static')
def url_for_static(filename):
    return url_for('static', filename=filename)

class Usuario:
    def __init__(self, nome, datanasc, email, celular, deficiencia, senha):
        self.nome = nome
        self.datanasc = datanasc
        self.email = email
        self.celular = celular
        self.deficiencia = deficiencia
        self.senha = senha

    def cadastrar(self):
        try:
            con = mysql.connector.connect(
                host="143.106.241.3",
                user="cl201174",
                password="essaehumasenha!",
                database="cl201174"
            )
            cursor = con.cursor()
            queue = "SELECT * FROM AC_Usuario WHERE email = %s"
            values = (self.email,)
            cursor.execute(queue, values)
            result = cursor.fetchall()

            if len(result) == 0:
                hash = bcrypt.hashpw(self.senha.encode('utf-8'), bcrypt.gensalt())
                queue = "INSERT INTO AC_Usuario (usuario, datanasc, email, celular, deficiencias, senha) VALUES (%s, %s, %s, %s, %s, %s)"
                values = (self.nome, self.datanasc, self.email, self.celular, ", ".join(self.deficiencia), hash)
                cursor.execute(queue, values)
                session['user_id'] = self.nome
                con.commit()
                cursor.close()
                con.close()
                print("1 dado modificado")
                return redirect('/')
            else:
                cursor.close()
                con.close()
                print("Email já cadastrado")
                flash("Email já cadastrado", "erro")
                return render_template("index.html")
        except Exception as err:
            print(f"ERRO: {err}")
            return False

    def login(self):
        try:
            con = mysql.connector.connect(
                host="143.106.241.3",
                user="cl201174",
                password="essaehumasenha!",
                database="cl201174"
            )
            cursor = con.cursor()
            queue = "SELECT * FROM AC_Usuario WHERE email = %s"
            values = (self.email,)
            cursor.execute(queue, values)
            result = cursor.fetchall()

            if len(result) > 0:
                dbhash = result[0][6].encode('utf-8')
                match = bcrypt.checkpw(self.senha.encode('utf-8'), dbhash)

                if match:
                    print(f"Result inteiro: {result[0]}\nResult[0][1]: {result[0][1]}")
                    session['user_id'] = result[0][1]
                    cursor.close()
                    con.close()
                    return render_template("index.html")
            cursor.close()
            con.close()
            print("Login falhou")
            return False
        except Exception as err:
            print(f"ERRO: {err}")
            return False

@app.route('/')
def index():
     return render_template("index.html")

@app.route('/tela')
def tela():
    return render_template("tela.html")

@app.route('/sobre')
def sobre():
    return render_template("sobre.html")

@app.route('/contato')
def contato():
    return render_template("contato.html")

@app.route('/documentos')
@login_necessario
def documentos():
    return render_template("documentos.html")

@app.route('/perfil')
@login_necessario
def perfil():
    return render_template("perfil.html")

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        user = request.form.get('user')
        date = request.form.get('date')
        try:
            datetime.strptime(date, '%Y-%m-%d')
            idade = datetime.now().year - int(date.split('-')[0])
            if idade < 18 or idade > 120:
                raise ValueError
        except (ValueError, TypeError):
            print("Idade inválida")
            flash("Erro no cadastro - Idade inválida.", "Error")
            return render_template('index.html')

        email = request.form.get('email')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            print("E-mail inválido")
            flash("Erro no cadastro - Email inválido.", "Error")
            return render_template('index.html')

        tel = request.form.get('tel')
        if not re.match(r"\d{2} \d{5}-\d{4}", tel):
            print("Telefone inválido")
            flash("Erro no cadastro - Telefone inválido.", "Error")
            return render_template('index.html')

        deficiencia = []
        if request.form.get('motora') == 'on':
            deficiencia.append('motora')
        if request.form.get('visual') == 'on':
            deficiencia.append('visual')
        if request.form.get('auditiva') == 'on':
            deficiencia.append('auditiva')
        if request.form.get('outros') == 'on':
            deficiencia.append('outro')

        password = request.form.get('password')
        usuario = Usuario(user, date, email, tel, deficiencia, password)
        resultado = usuario.cadastrar()

        if resultado:
            return render_template('index.html')
        
    else:
        return render_template("cadastro.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        usuario = Usuario("", "", email, "", [], password)
        resultado = usuario.login()

        if resultado:
            return render_template('index.html')
        else:
            flash("Erro no Login.", "Error")
            return render_template('login.html')
    
    else:
        return render_template('login.html')
    
@app.route('/sair', methods=["POST"])
def sair():
    if request.method == "POST":
        session.clear()
        return redirect("/")

@app.route('/email', methods = ["GET", "POST"])
def email():
    if request.method == "GET":
        sender = 'algumemail@gmail.com'
        senha = "senha"
        receiver = 'gkfvrcntzfwmlcfhpb@cwmxc.com'

        assunto = "Recuperação de senha"
        mensagem = 'Olá, vimos que você selecionou a opção de "trocar senha", para continuar <a href="ENDEREÇO DA TROCA DE EMIAL">acesse aqui</a>.'

        msg = MIMEMultipart()
        msg['De'] = sender
        msg['Para'] = receiver
        msg['Assunto'] = assunto
        msg.attach(MIMEText(mensagem, 'pain'))

        try:
            smtpObj = smtplib.SMTP('smtp.@gmail.com', 587)
            smtpObj.starttls()
            smtpObj.login(sender, senha)
            smtpObj.sendmail(sender, receiver, msg.as_string())
            smtpObj.quit()
            print("E-mail enviado com sucesso!")
            return redirect("/")

        except Exception as err:
            print(f"Erro: {err}")
            return redirect('/')
        
@app.route('/alteranome', methods = ["POST"])
@login_necessario
def alteranome():
    if request.method == "POST":
        nome = request.form.get("NOME")
        if nome != "" or nome != session['user_id']:
            print(nome)

if __name__ == '__main__':
    app.run(port=3000)
