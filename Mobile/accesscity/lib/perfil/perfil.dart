import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';
import 'widget_perfil.dart';

class Perfil extends StatelessWidget {
  Perfil({super.key});

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
          body: Center(
            child: WidPerfil(
              enabled: false,
            ),
          )),
    );
  }
}
