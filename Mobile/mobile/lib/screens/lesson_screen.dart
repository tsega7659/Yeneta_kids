
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/services/api_services.dart';
import 'dart:convert';
import '../utils/constants.dart';

class LessonScreen extends StatefulWidget {
  final String subject;
  final int level;
  final int sublevel;

  LessonScreen({required this.subject, required this.level, required this.sublevel});

  @override
  _LessonScreenState createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  List<dynamic> lessons = [];
  bool loading = true;
  final player = AudioPlayer();

  @override
  void initState() {
    super.initState();
    fetchLessons();
  }

  Future<void> fetchLessons() async {
    final token = await ApiService.getToken();
    final response = await http.get(
      Uri.parse('${Constants.baseUrl}/api/lessons?subject=${widget.subject}&level=${widget.level}&sublevel=${widget.sublevel}'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      setState(() {
        lessons = json.decode(response.body)['lessons'];
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('ፊደል - ሀ–በ')),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : GridView.builder(
              padding: EdgeInsets.all(16),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                childAspectRatio: 1,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: lessons.length,
              itemBuilder: (ctx, i) {
                final lesson = lessons[i];
                return GestureDetector(
                  onTap: () => playAudio(lesson['content']['audio']),
                  child: Card(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.network('${Constants.baseUrl}/images/${lesson['content']['image']}', height: 50),
                        Text(lesson['lesson_title'], style: TextStyle(fontSize: 32, fontFamily: 'NotoSansEthiopic')),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Future<void> playAudio(String file) async {
    await player.setUrl('${Constants.baseUrl}/audio/$file');
    player.play();
  }

  @override
  void dispose() {
    player.dispose();
    super.dispose();
  }
}
