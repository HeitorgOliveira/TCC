import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:accesscity/onibus.dart';

class Onibus extends StatefulWidget {
  Onibus({
    super.key,
  });

  @override
  State<Onibus> createState() => _OnibusState();
}

class _OnibusState extends State<Onibus> {
  bool _isSwitched = false;

  void Pesquisa() {
    print("Pesquisa");
  }

  void Carteira() {
    print("Carteira");
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'AccessCity',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: Scaffold(
            appBar: AppBar(
              //elevation: 10,
              backgroundColor: Variaveis.corAzul,
              actions: [
                //Pesquisa tem que ser um DropdownButton
                IconButton(
                  icon: Icon(Icons.search),
                  color: Variaveis.corFonte,
                  iconSize: 50,
                  onPressed: () {
                    Pesquisa();
                  },
                )
              ],
            ),
            //Menu
            drawer: Drawer(
              backgroundColor: Variaveis.corBg,
              child: ListView(padding: EdgeInsets.zero, children: <Widget>[
                DrawerHeader(
                  decoration: BoxDecoration(
                    color: Variaveis.corAzul,
                  ),
                  child: Row(
                    children: [
                      Text(
                        'AccessCity',
                        style: TextStyle(
                          color:
                              Color.fromARGB(255, 164, 26, 23), 
                          fontSize: 35,
                        ),
                      ),
                      Icon(
                        size: 30,
                        Icons.info_outline,
                        color: Color.fromARGB(255, 164, 26, 23),
                      )
                    ],
                  ),
                ),
                SizedBox(height: 20,),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.person),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/perfil');
                      }),
                  title: Text('Meu Perfil', style: TextStyle(fontSize: 15, fontFamily: 'Comfortaa', fontWeight: FontWeight.bold, color: Variaveis.corAzul),),
                ),
                SizedBox(height: 20,),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.wallet),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/documentos');
                      }),
                  title: Text('Meus documentos', style: TextStyle(fontSize: 15, fontFamily: 'Comfortaa', fontWeight: FontWeight.bold, color: Variaveis.corAzul),),
                ),
                SizedBox(height: 20,),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.settings),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/configuracoes');
                      }),
                  title: Text('Configurações', style: TextStyle(fontSize: 15, fontFamily: 'Comfortaa', fontWeight: FontWeight.bold, color: Variaveis.corAzul),),
                )
              ]),
            ),
            body: SingleChildScrollView(
              child: Column(children: [
                //Inicio mapa
                Container(
                  width: 600,
                  height: 900,
                  child: FlutterMap(
                    options: MapOptions(
                      center: LatLng(-22.560992, -47.423818),
                      zoom: 13.0,
                    ),
                    layers: [
                      TileLayerOptions(
                        urlTemplate:
                            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        subdomains: ['a', 'b', 'c'],
                      ),
                    ],
                  ),
                ),
              ]),
            ),
            floatingActionButton: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Container(
                    margin: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Variaveis.corAzul,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(padding: EdgeInsets.all(5)),
                        //Icone onibus
                        Icon(
                          Icons.bus_alert,
                          color: Variaveis.corFonte,
                          size: 35,
                        ),
                        //Switch
                        Switch(
                          activeColor: Variaveis.corFonte,
                          inactiveThumbColor: Variaveis.corFonte,
                          value: _isSwitched,
                          onChanged: (value) {
                            setState(() {
                              _isSwitched = value;
                              if (_isSwitched) {
                                Navigator.pushNamed(context, 'lugar');
                              }
                            });
                          },
                        ),
                        //Localização
                        Icon(
                          Icons.location_on,
                          color: Variaveis.corFonte,
                          size: 35,
                        ),
                        Padding(padding: EdgeInsets.all(5)),
                      ],
                    ),
                  ),
                  FloatingActionButton(
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              backgroundColor: Variaveis.corBg,
                              title: Text('Carteira', style: TextStyle(color: Variaveis.corAzul, fontFamily: 'Comfortaa')),
                              content: 

                              Image.asset('assets/carteira.png', width: 500,),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                  },
                                  child: Icon(
                                    Icons.close,
                                    color: Variaveis.corAzul,
                                  )
                                ),
                              ],
                            );
                          });
                    },
                    backgroundColor: Variaveis.corAzul,
                    child: Icon(
                      Icons.wallet,
                      color: Variaveis.corFonte,
                      size: 35,
                    ),
                  ),
                ])));
  }
}
