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
#include "../Api/PubApi/ledPub.cpp"

static int run = -1;
std::mutex mutex;

namespace SystemStatus
{

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

    void on_message(struct mosquitto *mosq, void *obj, const struct mosquitto_message *msg)
    {
        std::cout << "Message received on topic " << msg->topic << ": " << (char *)msg->payload << std::endl;
    }

    void on_disconnect(struct mosquitto *mosq, void *obj, int rc)
    {
        log(__LINE__, rc, "disconnect broker");
        if (rc != 0)
        {
            std::cerr << "Unexpected disconnection. Return code: " << rc << std::endl;
        }
        else
        {
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
        if (std::stoi(tempCpu) < 48)
        {
            LedPub::ledPub(1);
        }
        else
        {
            LedPub::ledPub(0);
        }

        file.close();

        return tempCpu;
    }
};
int main()
{
    int rc;
    struct mosquitto *mosq = NULL;
    std::string topic = "system/temperature";

    signal(SIGINT, SystemStatus::handle_sigint);
    signal(SIGSEGV, SystemStatus::handle_sigint);

    mosquitto_lib_init();
    mosq = mosquitto_new("receiver", true, NULL);
    if (mosq == NULL)
    {
        SystemStatus::log(__LINE__, rc, "Error create mosquitto");
        throw;
    }

    std::string willMsg = "SystemStatusApp.cpp | Client disconnected unexpectedly";
    rc = mosquitto_will_set(mosq, topic.c_str(), willMsg.length(), willMsg.c_str(), 1, 0);
    if (rc != MOSQ_ERR_SUCCESS)
    {
        SystemStatus::log(__LINE__, rc, "Error");
        throw;
    }

    mosquitto_connect_callback_set(mosq, SystemStatus::on_connect);
    mosquitto_message_callback_set(mosq, SystemStatus::on_message);
    mosquitto_disconnect_callback_set(mosq, SystemStatus::on_disconnect);

    rc = mosquitto_connect(mosq, "0.0.0.0", 1883, 60);

    while (true)
    {
        rc = mosquitto_loop(mosq, -1, 1);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            std::cerr << "Mosquitto loop error: " << mosquitto_strerror(rc) << std::endl;
            break;
        }
        else
        {
            std::string temp = SystemStatus::temperatureCpu();
            std::cout << "Temperature: " << temp << std::endl;
            mosquitto_publish(mosq, NULL, topic.c_str(), temp.length(), temp.c_str(), 1, true);
            std::this_thread::sleep_for(std::chrono::milliseconds(5000));
        }
    }

    mosquitto_destroy(mosq);
    mosquitto_lib_cleanup();
    return run;
}
