#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "IQOO Z3 5G";
const char* password = "aaaaaaaa";

// Web Server
WebServer server(80);

// GPIO Pins
const int heartbeatOut = 18;  // Pacing output
const int heartbeatIn  = 4;   // Comparator input
const int heartbeatLED = 23;  // Blinks on detected pulse
const int stimulusLED  = 26;  // Blinks on artificial pacing
const int dacPin       = 25;  // DAC1 output for comparator reference

// Variables
int bpmSetting = 60;
unsigned long heartbeatInterval = 1000;
unsigned long lastSecondCheck = 0;
unsigned long heartbeatLEDBlinkStart = 0;
bool heartbeatLEDBlinking = false;

volatile int pulseCount = 0;
volatile bool pulseDetectedFlag = false;

bool stimulusTriggered = false;
String lastEventMsg = "";
int refVoltageValue = 128;  // DAC 0–255 (~0–3.3V)


// ISR on rising edge from comparator
void IRAM_ATTR onPulseDetected() {
  pulseCount++;
  pulseDetectedFlag = true;
}

// --- Web Handlers ---
void handleRoot() {
  String html = "<html><body><h1>ESP32 Pacemaker</h1>"
                "<p>Current BPM: " + String(bpmSetting) + "</p></body></html>";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", html);
}

void handleSetBPM() {
  if (server.hasArg("bpm")) {
    bpmSetting = server.arg("bpm").toInt();
    heartbeatInterval = 60000 / bpmSetting;
    Serial.println("[Web] New BPM: " + String(bpmSetting));
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "BPM updated");
  } else {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "Missing bpm param");
  }
}

void handleSetRefVoltage() {
  if (server.hasArg("value")) {
    refVoltageValue = constrain(server.arg("value").toInt(), 0, 255);
    dacWrite(dacPin, refVoltageValue);

    float voltage = (refVoltageValue / 255.0) * 3.3;
    Serial.println("[Web] Reference voltage set to: " + String(voltage, 2) + " V");

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Reference voltage set to " + String(voltage, 2) + " V");
  } else {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "Missing 'value' param");
  }
}

void handleStatus() {
  String json = "{";
  json += "\"bpm\":" + String(bpmSetting) + ",";
  json += "\"stimulated\":" + String(stimulusTriggered ? "true" : "false") + ",";
  json += "\"lastEvent\":\"" + lastEventMsg + "\"";
  json += "}";
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

// CORS preflight support
void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);
}

// --- Setup ---
void setup() {
  Serial.begin(115200);

  pinMode(heartbeatOut, OUTPUT);
  pinMode(heartbeatIn, INPUT);
  pinMode(heartbeatLED, OUTPUT);
  pinMode(stimulusLED, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(heartbeatIn), onPulseDetected, RISING);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected. IP: " + WiFi.localIP().toString());

  // Setup Web Server routes
  server.on("/", handleRoot);
  server.on("/set_bpm", handleSetBPM);
  server.on("/set_ref", handleSetRefVoltage);
  server.on("/status", handleStatus);
  server.onNotFound(handleOptions); // Preflight CORS

  server.begin();

  // Initial DAC setting
  dacWrite(dacPin, refVoltageValue);
  lastSecondCheck = millis();
}

// --- Main Loop ---
void loop() {
  server.handleClient();
  unsigned long currentTime = millis();

  // Visual: Detected natural pulse
  if (pulseDetectedFlag) {
    pulseDetectedFlag = false;
    digitalWrite(heartbeatLED, HIGH);
    heartbeatLEDBlinkStart = currentTime;
    heartbeatLEDBlinking = true;
    lastEventMsg = "Pulse detected at " + String(currentTime) + "ms";
  }

  // Turn off LED after 50 ms
  if (heartbeatLEDBlinking && currentTime - heartbeatLEDBlinkStart > 50) {
    digitalWrite(heartbeatLED, LOW);
    heartbeatLEDBlinking = false;
  }

  // Every 1 sec: check if pacing is needed
  if (currentTime - lastSecondCheck >= 1000) {
    noInterrupts();
    int beats = pulseCount;
    pulseCount = 0;
    interrupts();

    if (beats == 0) {
      // No pulse → Stimulate
      stimulusTriggered = true;

      digitalWrite(stimulusLED, HIGH);
      digitalWrite(heartbeatOut, HIGH);
      delay(300);
      digitalWrite(heartbeatOut, LOW);
      digitalWrite(stimulusLED, LOW);

      lastEventMsg = "Stimulus triggered at " + String(currentTime) + "ms";
      Serial.println("[Stimulus Triggered]");
      lastSecondCheck = millis(); // RESET timer after pacing too
    } else {
      // Natural pulse detected
      stimulusTriggered = false;
      Serial.println("[Heartbeat OK] Natural BPM: " + String(beats * 60));
    }

    lastSecondCheck = currentTime;
  }
}
