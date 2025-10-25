import 'dart:io' show Platform;

class Constants {
  // Use a platform-aware base URL so emulators and simulators resolve correctly:
  // - Android emulator: 10.0.2.2 maps to host machine's localhost
  // - iOS simulator: localhost works for the host machine
  // - Physical devices: replace with your machine IP (e.g. 192.168.x.x)
  static String get baseUrl {
    if (Platform.isAndroid) return 'http://10.0.2.2:5000';
    if (Platform.isIOS) return 'http://localhost:5000';
    // Fallback (can be overridden by using your machine IP in environment or editing this file)
    return 'http://10.0.2.2:5000';
  }
}
