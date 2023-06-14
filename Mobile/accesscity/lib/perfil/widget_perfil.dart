// ignore_for_file: prefer_const_constructors

import 'package:accesscity/configuracoes/configuracoes.dart';
import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';
import 'package:masked_text/masked_text.dart';

class WidPerfil extends StatefulWidget {
  WidPerfil({super.key, this.enabled = false});

  bool enabled;

  @override
  State<WidPerfil> createState() => _WidPerfilState(enabled: enabled);
}

class _WidPerfilState extends State<WidPerfil> {
  _WidPerfilState({required this.enabled});

  //Declarando controllers
  TextEditingController _controlNome = TextEditingController(text: "Roberto da Silva");
  TextEditingController _controlData = TextEditingController();
  TextEditingController _controlCPF = TextEditingController();
  TextEditingController _controlCelular = TextEditingController();
  TextEditingController _controlDef = TextEditingController();

  bool enabled;
  bool auditiva = false;
  bool visual = false;
  bool motora = false;
  bool outra = false;

  void Alterar() {
    enabled = !enabled;
  }

  void Cancelar() {
    enabled = !enabled;
    _controlNome.clear();
    _controlData.clear();
    _controlCPF.clear();
    _controlCelular.clear();
    _controlDef.clear();
  }

  void Salvar() {
    print("salvou");
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        //Padding(padding: EdgeInsets.all(20)),
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            CircleAvatar(
              backgroundImage: NetworkImage(
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl8Ea9cyIi_U8y7mgzqX1SitKtppQOzlciXA&usqp=CAU"),
              radius: 80,
            ),
            //Botao de Alterar
            Visibility(
              visible: !enabled,
              child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: Variaveis.corAzul,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: TextButton(
                    onPressed: () => setState(Alterar),
                    child: Text(
                      "Alterar",
                      style: TextStyle(color: Variaveis.corFonte, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                    ),
                  )),
            ),
            //Botao de Salvar
            Visibility(
              visible: enabled,
              child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: Variaveis.corAzul,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: TextButton(
                    onPressed: () => setState(Alterar),
                    child: Text(
                      "Salvar",
                      style: TextStyle(color: Variaveis.corFonte, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                    ),
                  )),
            ),
            //Botao de cancelar
            Visibility(
              visible: enabled,
              child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: Variaveis.corAzul,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: TextButton(
                    onPressed: () => setState(Cancelar),
                    child: Text(
                      "Cancelar",
                      style: TextStyle(color: Variaveis.corFonte, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                    ),
                  )),
            ),
          ],
        ),
        SizedBox(height: 10),
        //Formulário
        Container(
          decoration: BoxDecoration(
            color: Color.fromARGB(255, 196, 203, 202),
            borderRadius: BorderRadius.circular(15),
          ),
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Form(
                child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                //Campo nome
                TextFormField(
                  controller: _controlNome,
                  enabled: enabled,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corFonte)),
                    labelText: 'Nome',
                    labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                  ),
                ),
                SizedBox(height: 20),
                //Campo data de nascimento
                MaskedTextField(
                  controller: _controlData,
                  enabled: enabled,
                  mask: "##/##/####",
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corAzul)),
                    labelText: 'Data de Nascimento',
                    labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                  ),
                ),
                SizedBox(height: 20),
                //Campo cpf
                MaskedTextField(
                  controller: _controlCPF,
                  enabled: enabled,
                  mask: '###.###.###-##',
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corAzul)),
                    labelText: 'CPF',
                    labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                  ),
                ),
                SizedBox(height: 20),
                //Campo celular
                MaskedTextField(
                  controller: _controlCelular,
                  enabled: enabled,
                  mask: '(##) #####-####',
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide(color: Variaveis.corAzul)),
                    labelText: 'Celular',
                    labelStyle: TextStyle(color: Variaveis.corAzul, fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),
                  ),
                ),
                SizedBox(height: 20),
                //Deficiências
                SizedBox(
                  width: double.infinity,
                  child: Text(
                    "Deficiências:",
                    textAlign: TextAlign.start,
                    style: TextStyle(
                      fontFamily: "Comfortaa",
                      color: Variaveis.corAzul,
                      fontSize: VariaveisConf.valorFonte,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Column(
                  children: [
                    //Auditiva
                    Row(children: [
                      Text("Auditiva", style: TextStyle(fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),),
                      Checkbox(
                        value: auditiva,
                        onChanged: (value) {
                          setState(() {
                            auditiva = value!;
                            print(auditiva);
                          });
                        },
                      ),
                    ]),
                    //Visual
                    Row(children: [
                      Text("Visual", style: TextStyle(fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),),
                      Checkbox(
                        value: visual,
                        onChanged: (value) {
                          setState(() {
                            visual = value!;
                            print(visual);
                          });
                        },
                      ),
                    ]),
                    //Motora
                    Row(children: [
                      Text("Motora", style: TextStyle(fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),),
                      Checkbox(
                        value: motora,
                        onChanged: (value) {
                          setState(() {
                            motora = value!;
                            print(motora);
                          });
                        },
                      ),
                    ]),
                    //Outra
                    Row(children: [
                      Text("Outra", style: TextStyle(fontSize: VariaveisConf.valorFonte, fontFamily: "Comfortaa"),),
                      Checkbox(
                        value: outra,
                        onChanged: (value) {
                          setState(() {
                            outra = value!;
                            print(outra);
                          });
                        },
                      ),
                    ])
                  ],
                )
              ],
            ))),
        ),
        SizedBox(height: 20),
      
      ],
    ),
    );
  }
}
