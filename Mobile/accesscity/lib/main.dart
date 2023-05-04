import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';


void main() {
  runApp(const MyApp());
}
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AccessCity',
      theme: ThemeData(
        primarySwatch: Colors.lightBlue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text("AccessCity"
        ),
      ),
      body: SingleChildScrollView( 
        child: Column(
          children: [SizedBox(
            width: 360,
            height: 560,
            child:
            FlutterMap(
              options: MapOptions(
                center: LatLng(-22.560992, -47.423818),
                zoom: 8.0, 
              ),
              layers: [
                TileLayerOptions(
                  urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  subdomains: ['a', 'b', 'c'],
                ),
              ],
            ),
          ),
        ]),
      ),
    )
    );
  }
}