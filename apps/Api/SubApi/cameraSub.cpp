#include <iostream>
#include <wiringPi.h>

void cameraLed(int status)
{
    int pin = 11;
    std::cout << "Raspberry Pi blink" << std::endl;

    if (wiringPiSetup() == -1)
    {
        std::cout << "Fail to setup wiringPi!!!" << std::endl;
        throw;
    }

    pinMode(pin, OUTPUT);

    if (status == 1)
    {
        digitalWrite(pin, HIGH);
        delay(5000);
        digitalWrite(pin, LOW);
    }
}
