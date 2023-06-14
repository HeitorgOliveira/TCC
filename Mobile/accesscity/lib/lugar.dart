import 'package:accesscity/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class Lugar extends StatefulWidget {
  const Lugar({super.key});

  @override
  State<Lugar> createState() => _LugarState();
}

class _LugarState extends State<Lugar> {
  bool _isSwitched = true;

  void Pesquisa(){
    print("Pesquisa");
  }

  void Carteira(){
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
                  child: Text(
                    'AccessCity',
                    style: TextStyle(
                      color: Color.fromARGB(255, 164, 26, 23), //vermelho errado
                      fontSize: 35,
                    ),
                  ),
                ),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.person),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/perfil');
                      }),
                  title: Text('Meu Perfil'),
                ),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.wallet),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/documentos');
                      }),
                  title: Text('Meus documentos'),
                ),
                ListTile(
                  leading: IconButton(
                      icon: Icon(Icons.settings),
                      color: Variaveis.corAzul,
                      iconSize: 50,
                      onPressed: () {
                        Navigator.pushNamed(context, '/configuracoes');
                      }),
                  title: Text('Configurações'),
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
                //Fim mapa
                //Footer
                /*Container(
                color: const Color.fromARGB(255, 8, 103, 136),
                height: 88,
                child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SizedBox(
                        width: 70,
                      ),
                      //Container do Switch
                      Container(
                        padding: EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          color: Color.fromARGB(255, 8, 103, 136),
                          borderRadius: BorderRadius.circular(50),
                          border: Border.all(
                            color: Colors.white,
                            width: 4,
                          ),
                        ),
                        child: Row(
                          children: [
                            Padding(padding: EdgeInsets.all(5)),
                            //Icone onibus
                            Icon(
                              Icons.bus_alert,
                              color: Colors.white,
                              size: 60,
                            ),
                            //Switch
                            Switch(
                              activeColor: Colors.white,
                              value: true,
                              onChanged: (value) {
                                print("VALUE : $value");
                              },
                            ),
                            //Localização
                            Icon(
                              Icons.location_on,
                              color: Colors.white,
                              size: 60,
                            )
                          ],
                        ),
                      ),
                      //Icon carteira
                      Container(
                        width: 70,
                        height: 70,
                        decoration: BoxDecoration(
                          color: Color.fromARGB(255, 8, 103, 136),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white,
                            width: 4,
                          ),
                        ),
                        child: IconButton(
                          icon: Icon(Icons.wallet),
                          color: Colors.white,
                          iconSize: 50,
                          onPressed: () {
                            Carteira();
                          },
                        ),
                      ),
                    ]),
              )*/
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
                          inactiveTrackColor: Variaveis.corFonte,
                          value: _isSwitched,
                          onChanged: (value) {
                            setState(() {
                              _isSwitched = value;
                              if(_isSwitched){
                                Navigator.pushNamed(context, '/onibus');
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
                ])));
  }
}