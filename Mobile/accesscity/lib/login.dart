// ignore_for_file: prefer_const_constructors

import 'package:accesscity/configuracoes/configuracoes.dart';
import 'package:accesscity/configuracoes/widget_configuracoes.dart';
import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController _controllerUsuario = TextEditingController();
  TextEditingController _controllerSenha = TextEditingController();
  String usuarioDigitado = "";
  String senhaDigitado = "";
  String usuario = "user";
  String senha = "1234";
  String warningusuario = "";
  String warningsenha = "";
  String warning = "";
  bool loginUsuario = false;
  bool loginSenha = false;

  void verificaUsuario(){
    if(usuarioDigitado == ""){
      print("Usuario vazio");
      loginUsuario = false;
      warningusuario = "Preencha o campo";
    }else{
      warningusuario = "";
      loginUsuario = true;
    }
  }

  void verificaSenha(){
    if(senhaDigitado == ""){
      print("Senha vazio");
      loginSenha = false;
      warningsenha = "Preencha o campo";
    }else{
      warningsenha = "";
      loginSenha = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: Variaveis.corAzul2,
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: double.infinity,
              margin: EdgeInsets.all(10),
              //alignment: Alignment.center,
              decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Variaveis.corBg,
                  ),
              child:Padding(
                padding: EdgeInsets.all(10),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Image.asset('assets/Logo3.png', width: 100,),
                  SizedBox(height: 30,),
                  Text("Login", style: TextStyle(fontFamily: "Comfortaa",
                    fontSize: VariaveisConf.valorFonteT, fontWeight: FontWeight.bold, color: Variaveis.corAzul),),
                  My_Text2(""),
                  TextField(
                    controller: _controllerUsuario,
                    onChanged: (value){
                      usuarioDigitado = value;
                    },
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corAzul)),
                      labelText: "Usuário", 
                      labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                    ),
                  ),
                  Text(warningusuario, style: TextStyle(fontSize: VariaveisConf.valorFonte, color: Colors.red),),
                  My_Text2(""),
                  TextField(
                    obscureText: true,
                    controller: _controllerSenha,
                    onChanged: (value){
                      senhaDigitado = value;
                    },
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corAzul)),
                      labelText: "Senha",
                      labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                    ),
                  ),
                  Text(warningsenha, style: TextStyle(fontSize: VariaveisConf.valorFonte, color: Colors.red),),
                  Text(warning, style: TextStyle(fontSize: VariaveisConf.valorFonte, color: Colors.red),),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                            backgroundColor: Variaveis.corAzul,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                    onPressed: (){
                      setState(() {
                        verificaUsuario();
                        verificaSenha();
                      });
                      if(loginSenha == true && loginUsuario == true){
                        print("verificando");
                        if(usuarioDigitado == usuario && senhaDigitado == senha){
                          Navigator.pushNamed(context, '/onibus');
                        }else{
                          setState(() {
                            warning = "Login ou senha incorretos";
                          });
                        }
                      }
                    }, 
                    child: Text("Entrar", style: TextStyle(color: Variaveis.corBranca, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),),
                  )
                ],
              ),
              )
               
            )
          ],
        ),
      ),
    );
  }
}

class My_Text2 extends StatelessWidget {
  My_Text2(this.texto, {super.key});

  String texto;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Text(texto,
          textAlign: TextAlign.justify,
          style: TextStyle(
            color: Variaveis.corPreta,
            fontSize: VariaveisConf.valorFonte,
          )),
    );
  }
}