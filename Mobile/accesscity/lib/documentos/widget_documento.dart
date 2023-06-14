import 'package:accesscity/configuracoes/configuracoes.dart';
import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';

class WidDoc extends StatelessWidget {
   WidDoc(this.texto, {super.key});

   String texto = "Documento 1";
   Image imagem = Image.asset("assets/images/rg.jpg");


  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Variaveis.corBg,
      ),
      child: Padding(
        padding: EdgeInsets.all(10),
        child: 
         Column(children: [
          Image.network("https://th.bing.com/th/id/OIP.OWdSLTo5pCMmFV859AZ4RQHaE8?pid=ImgDet&rs=1", height: 150, width: 200,),
          DecoratedBox(decoration: BoxDecoration(),
                child: Padding(
                  padding: EdgeInsets.all(4),
                  child: 
                  SizedBox(child: Row(children: [
                    Text(texto, style: TextStyle(fontSize: VariaveisConf.valorFonte, color: Variaveis.corAzul2, fontFamily: "Comfortaa"),),
                    Icon(Icons.drive_file_rename_outline, color: Variaveis.corAzul2,),
                  ]),)
                ),
          ),
         ]),
      ),
    );
  }
}