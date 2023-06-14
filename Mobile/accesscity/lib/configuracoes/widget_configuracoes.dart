// ignore_for_file: prefer_const_constructors

import 'package:accesscity/configuracoes/configuracoes.dart';
import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';

class My_Text extends StatelessWidget {
  My_Text(this.texto, {super.key});

  final String texto;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Text(texto,
          textAlign: TextAlign.start,
          style: TextStyle(
            color: Variaveis.corFonte,
            fontSize: VariaveisConf.valorFonte,
            fontWeight: FontWeight.bold,
            fontFamily: "Comfortaa",
          )),
    );
  }
}

class My_Titulo extends StatelessWidget {
  My_Titulo(this.titulo, {super.key});

  Color corAzul = Color.fromARGB(255, 9, 102, 136);
  Color corAzul2 = Color.fromARGB(255, 71, 122, 143);
  Color corBranca = Colors.white;
  Color corBg = Color.fromARGB(255, 196, 203, 202);
  Color corFonte = Color.fromARGB(255, 10, 15, 13);
  final String titulo;
  
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Text(titulo,
        textAlign: TextAlign.start,
        style: TextStyle(
          fontFamily: 'Comfortaa',
          color: Variaveis.corFonte, 
          fontSize: VariaveisConf.valorFonte*1.5, 
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}