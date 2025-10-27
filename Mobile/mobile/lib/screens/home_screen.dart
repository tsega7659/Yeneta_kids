import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatelessWidget {
  final List<Map<String, String>> subjects = [
    {'title': 'ፊደል', 'icon': 'amharic'},
    {'title': 'ሒሳብ', 'icon': 'math'},
    {'title': 'ሳይንስ', 'icon': 'science'},
    {'title': 'English', 'icon': 'english'},
    {'title': 'ተረት', 'icon': 'story'},
    {'title': 'ጀግኖች', 'icon': 'hero'},
  ];

   HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Yeneta Kids', style: TextStyle(fontFamily: 'NotoSansEthiopic')),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await SharedPreferences.getInstance().then((prefs) => prefs.clear());
              Navigator.pushReplacementNamed(context, '/');
            },
          )
        ],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: subjects.length,
        itemBuilder: (ctx, i) {
          return Card(
            elevation: 4,
            child: InkWell(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('${subjects[i]['title']} selected')),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.book, size: 48, color: Colors.deepOrange),
                  const SizedBox(height: 8),
                  Text(
                    subjects[i]['title']!,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'NotoSansEthiopic',
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}