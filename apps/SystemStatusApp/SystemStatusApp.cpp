#include <fstream>
#include <iostream>
#include <string>
#include <unistd.h>
#include <chrono>
#include <thread>
#include <mutex>
#include <vector>
#include <signal.h>
#include <mosquitto.h>
#include <nlohmann/json.hpp>

static int run = -1;
std::mutex mutex;

void log(int line, int rc = 0, std::string msg = "default")
{
    std::cout << "Line: " << line << " | rc: " << rc << " | Msg: " << msg << std::endl;
}

void handle_sigint(int signal)
{
    std::cout << "Catch signal: " << signal << std::endl;
    exit(1);
}

void on_connect(struct mosquitto *mosq, void *obj, int rc)
{
    if (rc != 0)
    {
        log(__LINE__, rc, "Connect failed with code");
    }
    else
    {
        log(__LINE__, rc, "Connected to the broker");
        std::lock_guard<std::mutex> lock(mutex);
        run = -1;
        mosquitto_subscribe(mosq, NULL, "ack/system/temperature", 1);
    }
}

void on_message(struct mosquitto *mosq, void *obj, const struct mosquitto_message *msg) {
    std::cout << "Message received on topic " << msg->topic << ": " << (char*)msg->payload << std::endl;
}

void on_disconnect(struct mosquitto *mosq, void *obj, int rc)
{
    log(__LINE__, rc, "disconnect broker");
    if (rc != 0) {
        std::cerr << "Unexpected disconnection. Return code: " << rc << std::endl;
    } else {
        std::cout << "Disconnected from MQTT broker." << std::endl;
    }
}

std::string temperatureCpu()
{
    std::string tempCpu = "";
    std::ifstream file("/sys/class/thermal/thermal_zone0/temp");
    if (!file)
    {
        std::cerr << "Error opening file" << std::endl;
        throw "Error opening file";
    }

    int temp;
    file >> temp;

    tempCpu = std::to_string(temp / 1000);
    std::cout << tempCpu << std::endl;
    file.close();

    return tempCpu;
}

void on_publish(struct mosquitto *, void *, int)
{
    std::cout << "On publish callback" << std::endl;
}

int main()
{
    int rc;
    struct mosquitto *mosq = NULL;
    std::string topic = "system/temperature";

    signal(SIGINT, handle_sigint);
    signal(SIGSEGV, handle_sigint);

    mosquitto_lib_init();
    mosq = mosquitto_new("receiver", true, NULL);
    if (mosq == NULL)
    {
        log(__LINE__, rc, "Error create mosquitto");
        throw;
    }

    std::string willMsg = "Client disconnected unexpectedly";
    rc = mosquitto_will_set(mosq, topic.c_str(), willMsg.length(), willMsg.c_str(), 1, 0);
    if (rc != MOSQ_ERR_SUCCESS)
    {
        log(__LINE__, rc, "Error");
        throw;
    }

    mosquitto_connect_callback_set(mosq, on_connect);
    mosquitto_message_callback_set(mosq, on_message);
    mosquitto_publish_callback_set(mosq, on_publish);
    mosquitto_disconnect_callback_set(mosq, on_disconnect);

    rc = mosquitto_connect(mosq, "0.0.0.0", 1883, 60);
            
    while (true) {
        rc = mosquitto_loop(mosq, -1, 1);
        if (rc != MOSQ_ERR_SUCCESS) {
            std::cerr << "Mosquitto loop error: " << mosquitto_strerror(rc) << std::endl;
            break;
        } else {
            std::string temp = temperatureCpu();
            std::cout << "Temperature: " << temp << std::endl;
            mosquitto_publish(mosq, NULL, topic.c_str(), temp.length(), temp.c_str(), 1, true);
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        }
    }

    mosquitto_destroy(mosq);
    mosquitto_lib_cleanup();
    return run;
}
