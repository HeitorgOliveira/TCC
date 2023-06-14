import 'package:accesscity/configuracoes/configuracoes.dart';
import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';
import 'widget_documento.dart';

class Documentos extends StatelessWidget {
  Documentos({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          backgroundColor: Variaveis.corBg,
          appBar: AppBar(
            backgroundColor: Variaveis.corAzul,
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
          ),
          body: SingleChildScrollView(
            child: Column(
              //mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                SizedBox(
                  height: 20,
                ),
                Text(
                  'Meus Documentos',
                  style: TextStyle(
                    fontFamily: "Comfortaa",
                    fontSize: VariaveisConf.valorFonteT,
                    color: Variaveis.corAzul2,
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                SizedBox(
                    height: 3,
                    width: 450,
                    child: Container(
                      color: Variaveis.corAzul2,
                    )
                ),
                Wrap(
                  spacing: 2.0,
                  runSpacing: 2.0,
                  children: [
                    WidDoc("CPF"),
                    WidDoc("RG"),
                    WidDoc("RG"),
                  ],
                )
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton(
          onPressed: (){
            print("adicionar documento");
          },
          child: Icon(Icons.add_rounded, color: Colors.white, size: 30),
          backgroundColor: Variaveis.corAzul,
          ),
          ),
    );
  }
}
