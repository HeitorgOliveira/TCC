from flask import Flask, request, render_template, url_for, session, flash, redirect, jsonify
from flask_session import Session
from datetime import datetime
from functools import wraps
from flask_cors import CORS
import re
import bcrypt
import mysql.connector


UPLOAD_FOLDER = "usuarios"

app = Flask(__name__)
CORS(app)

app.config["SESSION_PERMANENT"] = True      #Em caso de falsa, a sessão será encerrada ao fechar o navegador
app.config["SESSION_TYPE"] = 'filesystem'
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
Session(app)

def login_necessario(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'cpf' not in session:
            flash("Você não tem acesso a essa página", "error")
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
        #Retorna Nome, Nome de usuário, Email, celular e Data de nascimento do usuário em formato JSON
        data = {'cpf' : self.cpf, 'nome_completo': self.nome, 'nome_usuario': self.usuario, 'email': self.email, 'celular': self.celular, 'data_nascimento': self.datanasc}
        return jsonify(data)
    
    def get_nome_email(self):
        data = {'nome': self.nome, 'email': self.email}
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
                    print("Login falhou - Senha incorreta")
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

@app.route('/faq')
def faq():
    return render_template("faq.html")

@app.route('/documentos')
@login_necessario
def documentos():
    return render_template("documentos.html")

@app.route('/perfil')
@login_necessario
def perfil():
    try:
        con = mysql.connector.connect(
            host="143.106.241.3",
            user="cl201174",
            password="essaehumasenha!",
            database="cl201174"
        )
        cursor = con.cursor()
        queue = "SELECT * FROM AC_Usuario WHERE cpf = %s"
        values = (session['cpf'],)
        cursor.execute(queue, values)
        result = cursor.fetchall()
        if len(result) > 0:
            linha = result[0]
            nome = linha[1]
            user = linha[2]
            email = linha[3]
            celular = linha[4]
            datanasc = linha[5]

            dados = {
                'nome': nome,
                'usuario': user,
                'email': email,
                'celular': celular,
                'nascimento': datanasc,
            }
            return render_template("perfil.html", **dados), 200

        else:
            print("CPF inválido")
            return "ERRO - CPF inválido", 500
        
    except Exception as err:
        print(f"ERRO: {err}")
        return f"ERRO - {err}", 500

    

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        nomecompleto = request.form.get('nome')
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
        return render_template('cadastro.html')

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

@app.route('/deletar', methods = ["POST"])
def deletarusuario():
    
        if request.method == "POST":
            try:
                con = mysql.connector.connect(
                    host="143.106.241.3",
                    user="cl201174",
                    password="essaehumasenha!",
                    database="cl201174"
                )
                data_json = request.get_json()
                cpf = data_json.get('cpf')
                senha = data_json.get('senha')
                cursor = con.cursor()
                queue = "SELECT * FROM AC_Usuario WHERE cpf = %s"
                values = (cpf,)
                cursor.execute(queue, values)
                result = cursor.fetchall()

                if len(result) == 1:
                    dbhash = result[0][-1].encode('utf-8')
                    match = bcrypt.checkpw(senha.encode('utf-8'), dbhash)
                    if match:
                        queue = "DELETE * FROM AC_Usuario WHERE cpf = %s"
                        values = (cpf,)
                        cursor.execute(queue, values)
                        con.commit()
                        return "Usuário deletado com sucesso", 200
                    else:
                        return "Senha incorreta", 500
                return "Usuário não encontrado", 500
            except Exception as ex:
                print(f"ERRO - {ex}")
                return ex, 500
            finally:
                cursor.close()
                con.close()    
    
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
    
@app.route('/alteranome', methods = ["POST"])
@login_necessario
def alteranome():
    if request.method == "POST":
        nome = request.form.get("NOME")
        if nome != "" or nome != session['user_id']:
            print(nome)

@app.route('/trocadados', methods = ['POST'])
def trocadados():
    try:
        con = mysql.connector.connect(
            host="143.106.241.3",
            user="cl201174",
            password="essaehumasenha!",
            database="cl201174"
        )
        cursor = con.cursor()

        if request.method == 'POST':
            data_json = request.get_json()
            dados = {}

            cpf = data_json.get('cpf')
            email = data_json.get('email')
            nome = data_json.get('nome')
            username = data_json.get('username')
            celular = data_json.get('celular')
            data_nascimento = data_json.get('data_nascimento')

            if email != None:
                cursor = con.cursor()
                queue = "SELECT * FROM AC_Usuario WHERE email = %s"
                values = (email,)
                cursor.execute(queue, values)
                result = cursor.fetchall()

                if len(result) < 1:
                    dados["email"] = email
                else:
                    queue = "SELECT email FROM AC_Usuario WHERE cpf = %s"
                    values = (re.sub(r"\D", "", cpf),)
                    cursor.execute(queue, values)
                    result = cursor.fetchall()

                    start_index = str(result).find("'") 
                    end_index = str(result).rfind("'")
                    emailFormatado = str(result)[start_index + 1:end_index]
                    print(emailFormatado)

                    if emailFormatado == email: 
                        dados["email"] = email
                    else: 
                        print("Erro - Email já existe")
                        return 'Erro - Email já existe', 500
            
            if data_nascimento != None:
                try:
                    datetime.strptime(data_nascimento, '%Y-%m-%d')
                    idade = datetime.now().year - int(data_nascimento.split('-')[0])
                    print(idade)
                    if idade < 18 or int(data_nascimento.split('-')[0] )< 1907:
                        raise ValueError
                    else:
                        dados["datanascimento"] = data_nascimento
                except (ValueError, TypeError):
                    print("Idade inválida")
                    return 'Erro - Idade invalida', 500
            
            if celular != None:
                if not re.match(r"\d{2} \d{5}-\d{4}", celular):
                    print("Celular inválido - Número inválido")
                    return 'Erro - Celular inválido', 500
                else:
                    dados["celular"] = celular
            
            if nome != None:
                dados["nomecompleto"] = nome
            
            if username != None:
                cursor = con.cursor()
                queue = "SELECT * FROM AC_Usuario WHERE usuario = %s"
                values = (username,)
                cursor.execute(queue, values)
                result = cursor.fetchall()

                if len(result) < 1:
                    dados["usuario"] = username
                else:
                    queue = "SELECT usuario FROM AC_Usuario WHERE cpf = %s"
                    values = (re.sub(r"\D", "", cpf),)
                    cursor.execute(queue, values)
                    result = cursor.fetchall()

                    start_index = str(result).find("'") 
                    end_index = str(result).rfind("'")
                    userFormatado = str(result)[start_index + 1:end_index]
                    print(userFormatado)

                    if userFormatado == username: 
                        dados["usuario"] = username
                    else: 
                        print("Erro - Username já existe")
                        return 'Erro - Username já existe', 500
            
            print(f"Dados: {dados}")

            for i in dados:
                cursor = con.cursor()
                queue = f"UPDATE AC_Usuario SET {i} = '{dados[i]}' WHERE cpf = %s"
                values  = (cpf,)
                cursor.execute(queue, values)
                con.commit()

            return 'teste', 200

    except Exception as ex:
            print(f"Got exception: {ex}")
            return ex, 500
    
    finally:
        cursor.close()
        con.close()

@app.route('/trocadadosWeb', methods = ['POST'])
def trocadadosWeb():
    try:
        con = mysql.connector.connect(
            host="143.106.241.3",
            user="cl201174",
            password="essaehumasenha!",
            database="cl201174"
        )
        cursor = con.cursor()

        if request.method == 'POST':
            dados = {}

            cpf = session['cpf']
            email = request.form.get('email')
            nome = request.form.get('nome')
            username = request.form.get('user')
            celular = request.form.get('celular')
            data_nascimento = request.form.get('nascimento')


            if email != None:
                cursor = con.cursor()
                queue = "SELECT * FROM AC_Usuario WHERE email = %s AND cpf = %s"
                values = (email, cpf,)
                cursor.execute(queue, values)
                result = cursor.fetchall()

                if len(result) < 1:
                    queue = "SELECT * FROM AC_Usuario WHERE email = %s"
                    values = (email,)
                    cursor.execute(queue, values)
                    result = cursor.fetchall()

                    if len(result) < 1:
                        dados["email"] = email

                    else:
                        print("Erro - E-mail já existente")
                        return 'Erro - E-mail já existente', 500
            
            if data_nascimento != None:
                try:
                    datetime.strptime(data_nascimento, '%Y-%m-%d')
                    idade = datetime.now().year - int(data_nascimento.split('-')[0])
                    if idade < 18 or int(data_nascimento.split('-')[0] )< 1907:
                        raise ValueError
                    else:
                        dados["datanascimento"] = data_nascimento
                except (ValueError, TypeError):
                    print("Idade inválida")
                    return 'Erro - Idade invalida', 500
            
            if celular != None:
                if not re.match(r"\d{2} \d{5}-\d{4}", celular):
                    print("Celular inválido - Número inválido")
                    return 'Erro - Celular inválido', 500
                else:
                    dados["celular"] = celular
            
            if nome != None:
                dados["nomecompleto"] = nome
            
            if username != None:
                dados["usuario"] = username
            
            print(f"Dados: {dados}")

            for i in dados:
                cursor = con.cursor()
                queue = f"UPDATE AC_Usuario SET {i} = '{dados[i]}' WHERE cpf = %s"
                values  = (cpf,)
                cursor.execute(queue, values)
                con.commit()

            return redirect('/')

    except Exception as ex:
            print(f"Got exception: {ex}")
            return ex, 500
    
    finally:
        cursor.close()
        con.close()

@app.route('/retornadados', methods = ["GET"])
def retornadados():
    try:
        con = mysql.connector.connect(
            host="143.106.241.3",
            user="cl201174",
            password="essaehumasenha!",
            database="cl201174"
        )

        if request.method == "GET":
            data_json = request.get_json()

            cpf = data_json.get('cpf')

            cursor = con.cursor()
            queue = ("SELECT * FROM AC_Usuario WHERE cpf = %s")
            values = (cpf,)
            cursor.execute(queue, values)
            result = cursor.fetchall()
            print(result[0][1])
            print(result[0][3])

            usuario = Usuario(None, result[0][1], None, None, result[0][3], None, None, None)
            return usuario.get_nome_email(), 200
        
    except Exception as ex:
        print(f"Got exception {ex}")
        return ex, 500
    
    finally:
        cursor.close()
        con.close()

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
        if not re.match(r"^\d{3}\.\d{3}\.\d{3}-\d{2}$", cpf):
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
        
        usuario = Usuario(re.sub(r"\D", "", cpf), nome_completo, username, data_nascimento, email, celular, [], senha)
        resultado = usuario.cadastrar()
        if resultado:
            return usuario.get_todos_dados()
        else:
            return 'Email já cadastrado', 500
            
@app.route('/getavaliacao', methods = ['GET'])
def get_avaliacao():
    if request.method == "GET":
        json_data = request.get_json()
        id_lugar = json_data.get('id_lugar')
        try:
            con = mysql.connector.connect(
                host='143.106.241.3',
                user="cl201174",
                password="essaehumasenha!",
                database="cl201174"
            )
            cursor = con.cursor()
            queue = """SELECT id_lugar, comentario, pontuacao, usuario, fotoperfil
                       FROM AC_Avaliacoes 
                       INNER JOIN AC_Usuario ON AC_Usuario.cpf = cpf_usuario
                       WHERE id_lugar = %s"""
            values = (id_lugar,)
            cursor.execute(queue, values)
            result = cursor.fetchall()

            if len(result) > 0:
                lista = []
                for i in result:
                    lista.append( {"id_lugar": i[0], "comentario": i[1], "pontuacao": i[2], "usuario": i[3]})
                return(lista)
                #COLOCAR O RETORNO
            else:
                return f"O lugar de id {id_lugar} ainda não possui comentários", 500  
        except Exception as e:
            return f"ERRO {e}", 500
        finally:
            cursor.close()
            con.close()
    return 403

@app.route('/cadastraavaliacao', methods = ['POST'])
def avaliacao():
    if request.method == "POST":
        json_data = request.get_json()
        comentario = json_data.get('comentario')
        pontuacao = json_data.get('pontuacao')
        cpf_usuario = json_data.get('cpf')
        id_lugar = json_data.get('id_lugar')
        try:
            con = mysql.connector.connect(
                host="143.106.241.3",
                user="cl201174",
                password="essaehumasenha!",
                database="cl201174"
            )

            cursor = con.cursor()
            queue = "SELECT * FROM AC_Usuario WHERE CPF = %s"
            values = (cpf_usuario,)
            cursor.execute(queue, values)
            result = cursor.fetchall()

            if len(result) == 1:
                queue = "INSERT INTO AC_Avaliacoes (id, cpf_usuario, id_lugar, comentario, pontuacao) VALUES (NULL, %s, %s, %s, %s)"
                id_lugar = int(id_lugar)
                pontuacao = int(pontuacao)
                values = (cpf_usuario, id_lugar, comentario, pontuacao,)
                cursor.execute(queue, values)
                con.commit()
                return "Avaliação enviada com sucesso"
            return 'ERRO - CPF não encontrado', 500
        except Exception as e:
            return f'ERRO - {e}', 500

        finally:
            cursor.close()
            con.close()
    return 'ERRO', 500

@app.route('/usuario_deficiencia', methods = ['POST'])
def usuario_deficiencia():
    if request.method == 'POST':
        try:
            con = mysql.connector.connect(
                    host="143.106.241.3",
                    user="cl201174",
                    password="essaehumasenha!",
                    database="cl201174"
                )
            
            json_data = request.get_json()
            cpf_usuario = json_data.get('cpf_usuario')
            nome_deficiencia = json_data.get('nome_deficiencia')
            cursor = con.cursor()
            queue = "SELECT * FROM AC_Usuario WHERE CPF = %s"
            values = (cpf_usuario,)
            cursor.execute(queue, values)
            nuser = cursor.fetchall()

            queue = "SELECT codigo FROM AC_Deficiencias WHERE nome = %s"
            values = (nome_deficiencia,)
            cursor.execute(queue, values)
            ndeficiencia = cursor.fetchall()

            if len(ndeficiencia) == 0:
                return "Deficiencia não consta no banco de dados", 500

            if len(nuser) and len(ndeficiencia) == 1:
                codigo_deficiencia = ndeficiencia[0][0]
                queue = "INSERT INTO AC_Usuario_Deficiencias (id, codigo, cpf) VALUES (NULL, %s, %s)"
                values = (codigo_deficiencia, cpf_usuario)
                cursor.execute(queue, values)
                con.commit()
                return "Associação feita com sucesso", 200
            
            else:
                return "ERRO - usuário não consta no banco de dados", 500
            
        except Exception as e:
            return f"ERRO - {e}", 500
        finally:
            cursor.close()
            con.close()
    return

if __name__ == '__main__':
    app.run(port=3000)
