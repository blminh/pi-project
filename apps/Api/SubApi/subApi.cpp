#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <mutex>
#include <mosquitto.h>
#include <signal.h>
#include <nlohmann/json.hpp>
// #include "led.cpp"
#include "thread"

static int run = -1;
std::mutex mutex;

void handle_sigint(int signal)
{
    std::cout << "Catch signal: " << signal << std::endl;
    {
        std::lock_guard<std::mutex> lock(mutex);
        run = 0;
    }
    exit(1);
}

void on_connect(struct mosquitto *mosq, void *obj, int rc)
{
    if (rc != 0)
    {
        exit(1);
    }
}

void on_disconnect(struct mosquitto *mosq, void *obj, int rc)
{
    std::lock_guard<std::mutex> lock(mutex);
    run = rc;
}

int on_message_callback(struct mosquitto *mosq, void *userdata, const struct mosquitto_message *message)
{
    std::cout << "----- Message -----" << std::endl;
    std::cout << "Subscriber sub_client received message of topic: " << message->topic << " | Data: " << reinterpret_cast<char *>(message->payload) << "\n";

    std::string topic = static_cast<const char *>(message->topic);
    std::string msg = static_cast<const char *>(message->payload);
    nlohmann::json data = nlohmann::json::parse(msg);

    // std::thread changeLed(led, data["pin"], data["status"]);
    // changeLed.detach();
    return 0;
}

void subApi()
{
    int rc;
    struct mosquitto *mosq = NULL;

    signal(SIGINT, handle_sigint);
    signal(SIGSEGV, handle_sigint);

    std::thread lcd(showLCD16);
    lcd.detach();

    mosquitto_lib_init();

    mosq = mosquitto_new("sender", true, NULL);
    if (mosq == NULL)
    {
        throw;
    }

    mosquitto_connect_callback_set(mosq, on_connect);
    mosquitto_disconnect_callback_set(mosq, on_disconnect);

    mosquitto_subscribe_callback(
        on_message_callback,
        NULL,
        "control-led",
        0,
        "0.0.0.0",
        1883,
        "sender",
        60,
        true,
        NULL, NULL, NULL,
        NULL);

    mosquitto_destroy(mosq);
    mosquitto_lib_cleanup();
}
