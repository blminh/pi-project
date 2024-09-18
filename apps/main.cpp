#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <thread>
#include <mutex>
#include <signal.h>

#include <mosquitto.h>
#include <nlohmann/json.hpp>
#include "./Api/SubApi/led.cpp"
#include "./Api/SubApi/cameraLed.cpp"

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
        run = rc;
        exit(1);
    }
    else
    {
        mosquitto_subscribe(mosq, NULL, "led/led1", 1);
    }
}

void on_disconnect(struct mosquitto *mosq, void *obj, int rc)
{
    std::lock_guard<std::mutex> lock(mutex);
    run = rc;
}

void on_message(struct mosquitto *mosq, void *userdata, const struct mosquitto_message *message)
{
    std::cout << "----- Message -----" << std::endl;
    std::cout << "Subscriber sub_client received message of topic: " << message->topic << " | Data: " << reinterpret_cast<char *>(message->payload) << "\n";

    std::string topic = static_cast<const char *>(message->topic);
    std::string msg = static_cast<const char *>(message->payload);
    try
    {
        std::cout << "Topic" << topic << std::endl;
        std::cout << "Msg" << msg << std::endl;
        nlohmann::json data = nlohmann::json::parse(msg);
        std::cout << "Data" << data["status"] << std::endl;

        if (topic == "led/led1")
        {
            std::thread changeLed(led, data["status"]);
            changeLed.join();
        }
        else if (topic == "home/camera")
        {
            std::thread changeLed(cameraLed, data["status"]);
            changeLed.join();
        }
    }
    catch (...)
    {
        std::cout << "Catch error!" << std::endl;
    }
}

int main()
{
    int rc;
    struct mosquitto *mosq = NULL;

    signal(SIGINT, handle_sigint);
    signal(SIGSEGV, handle_sigint);

    mosquitto_lib_init();

    mosq = mosquitto_new("sender", true, NULL);
    if (mosq == NULL)
    {
        throw;
    }

    mosquitto_connect_callback_set(mosq, on_connect);
    mosquitto_message_callback_set(mosq, on_message);
    mosquitto_disconnect_callback_set(mosq, on_disconnect);

    rc = mosquitto_connect(mosq, "0.0.0.0", 1883, 60);

    while (run == -1)
    {
        rc = mosquitto_loop(mosq, -1, 1);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            std::cerr << "Mosquitto loop error: " << mosquitto_strerror(rc) << std::endl;
            break;
        }
    }

    mosquitto_destroy(mosq);
    mosquitto_lib_cleanup();

    return run;
}
