// ignore_for_file: prefer_const_constructors

import 'package:accesscity/main.dart';
import 'package:accesscity/configuracoes/widget_configuracoes.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


class Configuracao extends StatefulWidget {
  const Configuracao({super.key});

  @override
  State<Configuracao> createState() => _ConfiguracaoState();
}

class VariaveisConf {
  static double valorFonte = 20;
  static double valorFonteT = 30;
  static bool notificacao = true;
  static bool light = false;
}

class _ConfiguracaoState extends State<Configuracao> {
  void ModoEscuro() {
    if (VariaveisConf.light == false) {
      Variaveis.corAzul = Color.fromARGB(255, 9, 102, 136);
      Variaveis.corAzul2 = Color.fromARGB(255, 71, 122, 143);
      Variaveis.corBg = Color.fromARGB(255, 196, 203, 202);
      Variaveis.corBranca = Colors.white;
      Variaveis.corPreta = Colors.black;
      Variaveis.corFonte = Colors.white;
    } else {
      Variaveis.corAzul = Color.fromARGB(255, 10, 59, 75);
      Variaveis.corAzul2 = Color.fromARGB(255, 9, 102, 136);
      Variaveis.corBg = Color.fromARGB(255, 10, 15, 13); 
      Variaveis.corBranca = Color.fromARGB(255, 255, 255, 255);
      Variaveis.corPreta = Colors.black;
      Variaveis.corFonte = Color.fromARGB(255, 196, 203, 202);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          backgroundColor: Variaveis.corBg,
          appBar: AppBar(
            leading: IconButton(
              icon: Icon(
                Icons.arrow_back,
                size: 40,
                color: Variaveis.corFonte,
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/onibus');
              },
            ),
            backgroundColor: Variaveis.corAzul,
          ),
          body: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(padding: EdgeInsets.all(20)),

                //Minha conta
                Container(
                  width: double.infinity,
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Variaveis.corPreta),
                    color: Variaveis.corAzul,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SizedBox(height: 15,),
                      My_Titulo("Minha conta"),
                      SizedBox(height: 15,),
                      My_Text("Alterar minha senha"),
                      //Botao
                      Align(
                        alignment: Alignment.centerLeft,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Variaveis.corFonte,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          onPressed: () {
                            print("Mudar senha");
                          },
                          child: Text(
                            'Mudar senha',
                            style: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                          ),
                        ),
                      ),
                      SizedBox(height: 20,),
                      My_Text("Apagar minha conta"),
                      //Botao 2
                      Align(
                        alignment: Alignment.centerLeft,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Variaveis.corFonte,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          onPressed: () {
                            print("Apagar conta");
                          },
                          child: Text(
                            'Apagar conta',
                            style: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: 'Comfortaa'),
                          ),
                        ),
                      ),
                      SizedBox(height: 15,),
                    ],
                  ),
                ),

                Container(
                  width: double.infinity,
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Variaveis.corPreta),
                    color: Variaveis.corAzul,
                  ),
                  child: Column(
                    children: [
                      SizedBox(height: 15,),
                      My_Titulo("Notificações"),
                      SizedBox(height: 15,),
                      My_Text("Permitir notificações?"),
                      //Switch
                      Row(
                        children: [
                          Icon(
                            Icons.close,
                            size: 35,
                            color: Variaveis.corFonte,
                          ),
                          Switch(
                            value: VariaveisConf.notificacao,
                            activeColor: Variaveis.corFonte,
                            inactiveThumbColor: Variaveis.corFonte,
                            onChanged: (bool value) {
                              setState(() {
                                VariaveisConf.notificacao =
                                    !VariaveisConf.notificacao;
                                print(VariaveisConf.notificacao);
                              });
                            },
                          ),
                          Icon(
                            Icons.check,
                            size: 35,
                            color: Variaveis.corFonte,
                          ),
                        ],
                      ),
                      SizedBox(height: 15,),
                    ],
                  ),
                ),

                //Aparência
                Container(
                  width: double.infinity,
                  margin: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Variaveis.corPreta),
                    color: Variaveis.corAzul,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SizedBox(height: 15,),
                      My_Titulo("Aparência"),
                      SizedBox(height: 15,),
                      My_Text("Tamanho da fonte"),
                      //Barrinha
                      Slider(
                        activeColor: Variaveis.corFonte,
                        value: VariaveisConf.valorFonte,
                        min: 0,
                        max: 30,
                        divisions: 15,
                        label: VariaveisConf.valorFonte.toString(),
                        onChanged: (novoValor) {
                          setState(() {
                            if (VariaveisConf.valorFonte <= 30 || VariaveisConf.valorFonte >= 8) {
                              VariaveisConf.valorFonte = novoValor;
                              VariaveisConf.valorFonteT = novoValor + 4;
                            } else if (VariaveisConf.valorFonte > 30){
                              VariaveisConf.valorFonte = 30;
                              VariaveisConf.valorFonteT = 34;
                              print(VariaveisConf.valorFonte);
                            } else if (VariaveisConf.valorFonte <= 8){
                              VariaveisConf.valorFonte = 8;
                              VariaveisConf.valorFonteT = 12;
                              print(VariaveisConf.valorFonte);
                            }
                          });
                        },
                      ),
                      SizedBox(height: 15,),
                      My_Text("Modo escuro"),
                      //Switch
                      Row(
                        children: [
                          Icon(
                            Icons.sunny,
                            color: Variaveis.corFonte,
                            size: 35,
                          ),
                          Switch(
                            value: VariaveisConf.light,
                            activeColor: Variaveis.corFonte,
                            inactiveThumbColor: Variaveis.corFonte,
                            onChanged: (bool value) {
                              setState(() {
                                VariaveisConf.light = !VariaveisConf.light;
                                ModoEscuro();
                              });
                            },
                          ),
                          Icon(
                            Icons.nightlight_round,
                            color: Variaveis.corFonte,
                            size: 35,
                          ),
                        ],
                      ),
                      SizedBox(height: 15,),
                    ],
                  ),
                ),
              ],
            ),
          )),
    );
  }
}
