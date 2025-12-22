#include <Arduino.h>
#include <U8g2lib.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

#define PIN_RGB_MATRIX 0

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(8, 8, PIN_RGB_MATRIX,
                            NEO_MATRIX_TOP + NEO_MATRIX_LEFT +
                            NEO_MATRIX_ROWS,
                            NEO_RGB + NEO_KHZ800);

const uint16_t colors[] = {
  matrix.Color(0, 0, 255), matrix.Color(0, 0, 255), matrix.Color(0, 0, 255)
 
};



U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, 6, 5);
void setup() {
  // put your setup code here, to run once:

  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(6);
  matrix.setTextColor(colors[0]);


  pinMode(8, OUTPUT);
  pinMode(21, OUTPUT);
  u8g2.begin();
  u8g2.setContrast(255); // set contrast to maximum 
  u8g2.setBusClock(400000); //400kHz I2C 
  u8g2.setFont(u8g2_font_ncenB10_tr);

  Serial.begin(9600);
}

int width = 72; 
int height = 40; 
int i = 0;
void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);

  u8g2.clearBuffer(); // clear the internal memory
  u8g2.drawFrame(0, 0, width, height); //draw a frame around the border
  u8g2.setCursor(15, 25);
  u8g2.printf("%d", i);
  u8g2.sendBuffer(); // transfer internal memory to the display
  Serial.print("Serial: ");
  Serial.println(i++);

  matrix.fillScreen(1);
  matrix.setCursor(0, 0);
  matrix.printf("%d", i);
  matrix.show();
}
