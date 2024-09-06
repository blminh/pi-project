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

namespace LedPub
{
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
        }
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

    void ledPub(int &&status)
    {
        int rc;
        struct mosquitto *mosq = NULL;
        std::string topic = "led/led1";

        signal(SIGINT, handle_sigint);
        signal(SIGSEGV, handle_sigint);

        mosquitto_lib_init();
        mosq = mosquitto_new("systemStatusLed", true, NULL);
        if (mosq == NULL)
        {
            log(__LINE__, rc, "Error create mosquitto");
            throw;
        }

        std::string willMsg = "ledPub.cpp | Client disconnected unexpectedly";
        rc = mosquitto_will_set(mosq, topic.c_str(), willMsg.length(), willMsg.c_str(), 1, 0);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            log(__LINE__, rc, "Error");
            throw;
        }

        mosquitto_connect_callback_set(mosq, on_connect);
        mosquitto_disconnect_callback_set(mosq, on_disconnect);

        rc = mosquitto_connect(mosq, "0.0.0.0", 1883, 60);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            std::cout << "Failed to connect: " << mosquitto_strerror(rc) << std::endl;
            throw;
        }

        nlohmann::json j;
        j["status"] = status;
        std::string data = j.dump();
        mosquitto_publish(mosq, NULL, topic.c_str(), data.length(), data.c_str(), 1, true);

        mosquitto_destroy(mosq);
        mosquitto_lib_cleanup();
    }
};