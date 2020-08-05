
void socket_Connected(const char * payload, size_t length) {
  Serial.println("Socket.IO Connected!");
  pinMode(LEDPin, OUTPUT);
  digitalWrite(LEDPin, 1);
  delay(100);
  digitalWrite(LEDPin, 0);
  delay(100);
}

void socket_sendMac(const char * payload, size_t length) {
  Serial.println("GOT MAC REQUEST");
  const size_t capacity = JSON_OBJECT_SIZE(1) + 50;
  DynamicJsonDocument doc(capacity);
  doc["macAddress"] = WiFi.macAddress();
  String bodyReq;
  serializeJson(doc, bodyReq);
  Serial.println(bodyReq);
  webSocket.emit("mac", bodyReq.c_str());
}

void socket_event(const char * payload, size_t length) {
  Serial.print("got message: ");
  Serial.println(payload);
}

void socket_msg(const char * payload, size_t length) {
  Serial.println("got msg");
  const size_t capacity = JSON_OBJECT_SIZE(2) + 50;
  DynamicJsonDocument incomingDoc(capacity);
  deserializeJson(incomingDoc, payload);
  const char* recMacAddress = incomingDoc["macAddress"];
  const char* recData = incomingDoc["data"];
  Serial.print("I got a message from ");
  Serial.println(recMacAddress);
  Serial.print("Which is ");
  Serial.println(recData);
  String testt = String(recData);
  if (testt.indexOf("hello") > -1) {
    LEDState = !LEDState;
  }

}