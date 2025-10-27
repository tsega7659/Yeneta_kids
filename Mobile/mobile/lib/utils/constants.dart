import 'dart:io' show Platform;

class Constants {
  static String get baseUrl {
    if (Platform.isAndroid) return 'http://10.53.173.66:5000';
    if (Platform.isIOS) return 'http://localhost:5000';
    return 'http://10.53.173.66:5000';
  }
}
