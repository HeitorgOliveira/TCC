from flask import Flask, request, render_template, url_for, session, flash, redirect, jsonify
from flask_session import Session
from datetime import datetime
from functools import wraps
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import bcrypt
import mysql.connector
import smtplib
import base64
UPLOAD_FOLDER = "usuarios"

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = True      #Em caso de falsa, a sessão será encerrada ao fechar o navegador
app.config["SESSION_TYPE"] = 'filesystem'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
Session(app)

def login_necessario(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'cpf' not in session:
            flash("Você não tem acesso a esta página", "error")
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function

@app.template_filter('url_for_static')
def url_for_static(filename):
    return url_for('static', filename=filename)

class Usuario:
    def __init__(self, cpf, nome, usuario, datanasc, email, celular, deficiencia, senha):
        self.cpf = cpf
        self.nome = nome
        self.usuario = usuario
        self.email = email
        self.celular = celular
        self.datanasc = datanasc
        self.deficiencia = deficiencia
        self.senha = senha

    def get_todos_dados(self):
        data = {'cpf' : self.cpf, 'nome_completo': self.nome, 'nome_usuario': self.usuario, 'email': self.email, 'celular': self.celular, 'data_nascimento': self.datanasc}
        return jsonify(data)


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
                queue = "INSERT INTO AC_Usuario (cpf, nomecompleto, usuario, email, celular, datanascimento, senha) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                values = (self.cpf, self.nome, self.usuario, self.email, self.celular, self.datanasc, hash)
                cursor.execute(queue, values)
                session['cpf'] = self.cpf
                con.commit()
                cursor.close()
                con.close()
                print("1 dado modificado")
                return True
            else:
                cursor.close()
                con.close()
                print("Email já cadastrado")
                flash("Email já cadastrado", "erro")
                return False
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
                dbhash = result[0][-1].encode('utf-8')
                match = bcrypt.checkpw(self.senha.encode('utf-8'), dbhash)

                if match:
                    queue = "SELECT * FROM AC_Usuario WHERE cpf = %s"
                    values = (result[0][0],)
                    cursor.execute(queue, values)
                    result = cursor.fetchone()
                    self.cpf = result[0]
                    self.nome = result[1]
                    self.usuario = result[2]
                    self.email = result[3]
                    self.celular = result[4]
                    self.datanasc = result[5]
                    session['cpf'] = self.cpf
                    con.commit()
                    cursor.close()
                    con.close()
                    return True
                else:
                    print("Login falhou - Senha não bate")
                    return False
            cursor.close()
            con.close()
            print("Login falhou - E-mail não encontrado")
            return False
        except Exception as err:
            print(f"ERRO: {err}")
            return False

    def addfoto(self, foto):
        try:
            con = mysql.connector.connect(
                host="143.106.241.3",
                user="cl201174",
                password="essaehumasenha!",
                database="cl201174"
            )
            cursor = con.cursor()
            queue = "SELECT * FROM AC_Usuario WHERE cpf = %s"
            values = (self.cpf,)
            cursor.execute(queue, values)
            result = cursor.fetchall()
            if len(result) > 0:
                queue = "UPDATE AC_Usuario SET fotoperfil = %s WHERE cpf = %s"
                values = (foto, self.cpf)
                cursor.execute(queue, values)
                con.commit()
                cursor.close()
                con.close()
                return True
            else:
                print("Erro na adição de foto de perfil")
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
        nomecompleto = request.form.get('nomecompleto')
        user = request.form.get('user')
        date = request.form.get('date')
        cpf = request.form.get('cpf')

        #Validar o CPF:
        if len(cpf) != 11:
            return redirect('/')
        
        #Validar a idade:
        try:
            datetime.strptime(date, '%Y-%m-%d')
            idade = datetime.now().year - int(date.split('-')[0])
            if idade < 18 or idade > 120:
                raise ValueError
        except (ValueError, TypeError):
            print("Idade inválida")
            flash("Erro no cadastro - Idade inválida.", "Error")
            return redirect('/')

        #Validar o email:
        email = request.form.get('email')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            print("E-mail inválido")
            flash("Erro no cadastro - Email inválido.", "Error")
            return redirect('/')

        #Validar o telefone:
        tel = request.form.get('tel')
        if not re.match(r"\d{2} \d{5}-\d{4}", tel):
            print("Telefone inválido")
            flash("Erro no cadastro - Telefone inválido.", "Error")
            return redirect('/')

        password = request.form.get('password')
        #cpf, nome, usuario, datanasc, email, celular, deficiencia, senha
        usuario = Usuario(cpf, nomecompleto, user, date, email, tel, [], password)
        resultado = usuario.cadastrar()

        if resultado:
            return redirect('/')
        else:
            return redirect('/')
    else:
        return redirect('/')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        #cpf, nome, usuario, datanasc, email, celular, deficiencia, senha
        usuario = Usuario("", "", "", "", email, "", [], password)
        resultado = usuario.login()

        if resultado:
            return redirect('/')
        else:
            flash("Erro no Login.", "Error")
            return redirect('/login')
    
    else:
        return render_template('login.html')
    
@app.route('/sair', methods=["POST"])
def sair():
    if request.method == "POST":
        session.clear()
        return redirect("/")
    
@app.route('/addfoto', methods = ["POST"])
def addfoto():
    if request.method == "POST":
        file = request.files['foto']
        if file.filename == "":
            flash('Nenhum arquivo selecionado')
            return redirect('/')

        if file:
            foto  = file.read()
            cpf = session.get('cpf')
            usuario = Usuario(cpf, "", "", "", "", "", [], "")
            if usuario.addfoto(foto):
                print("Sucesso ao trocar a foto")
                return redirect('/')
            else:
                print("Erro ao alterar foto")
                return redirect('/')



@app.route('/email', methods = ["GET", "POST"])
def email():
    if request.method == "GET":
        sender = 'algumemail@gmail.com'
        senha = "senha"
        receiver = 'gkfvrcntzfwmlcfhpb@cwmxc.com'

        assunto = "Recuperação de senha"
        mensagem = 'Olá, vimos que você selecionou a opção de trocar senha, para continuar <a href="ENDEREÇO DA TROCA DE EMAIL">acesse aqui</a>.'

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

@app.route('/mobile/login', methods = ["POST"])
def login_mobile():
    if request.method == "POST":
        data_json = request.get_json()

        email = data_json.get('email')
        senha = data_json.get('senha')
        usuario = Usuario("", "", "", "", email, "", [], senha)
        resultado = usuario.login()
        if resultado:
            return usuario.get_todos_dados() 

@app.route('/mobile/registro', methods = ["POST"])
def registro_mobile():
    if request.method == "POST":
        data_json = request.get_json()

        cpf = data_json.get('cpf')
        nome_completo = data_json.get('nome_completo')
        username = data_json.get('username')
        email = data_json.get('email')
        celular = data_json.get('celular')
        data_nascimento = data_json.get('data_nascimento')
        senha = data_json.get('senha')

        #Validação do CPF:
        if len(cpf) != 11:
            return 'Erro - CPF invalido (cpf deve ter 11 digitos)', 500
        
        #Validação da data de nascimento:
        try:
            datetime.strptime(data_nascimento, '%Y-%m-%d')
            idade = datetime.now().year - int(data_nascimento.split('-')[0])
            if idade < 18 or int(data_nascimento.split('-')[0] )< 1907:
                raise ValueError
        except (ValueError, TypeError):
            print("Idade inválida")
            return 'Erro - Idade invalida', 500
        
        #validaçaõ do email
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            print("E-mail inválido - formato inválido")
            return 'Erro - Email inválido', 500
        
        #Validação do telefone
        if not re.match(r"\d{2} \d{5}-\d{4}", celular):
            print("Celular inválido - Número inválido")
            return 'Erro - Celular inválido', 500
        
        usuario = Usuario(cpf, nome_completo, username, data_nascimento, email, celular, [], senha)
        resultado = usuario.cadastrar()
        if resultado:
            return usuario.get_todos_dados()
        else:
            return 'Email já cadastrado', 500

        
if __name__ == '__main__':
    app.run(port=3000)
