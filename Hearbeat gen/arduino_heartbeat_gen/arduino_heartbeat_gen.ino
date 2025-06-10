const int pulsePin = 9;

unsigned long lastPulseTime = 0;
unsigned long pulseCount = 0;

void setup() {
  pinMode(pulsePin, OUTPUT);
  Serial.begin(9600);
  while (!Serial); // Wait for Serial if needed
  Serial.println("=== Pulse Generator Started ===");
  Serial.println("Sending 300ms HIGH pulse every 2 seconds");
}

void loop() {
  unsigned long currentTime = millis();

  // Start pulse
  digitalWrite(pulsePin, HIGH);
  lastPulseTime = currentTime;
  pulseCount++;

  Serial.print("Pulse ");
  Serial.print(pulseCount);
  Serial.print(" sent at ");
  Serial.print(currentTime / 1000.0, 3);
  Serial.println(" s");

  delay(300); // HIGH time (300 ms)

  // End pulse
  digitalWrite(pulsePin, LOW);
  delay(1000); // LOW time (1700 ms)
}
