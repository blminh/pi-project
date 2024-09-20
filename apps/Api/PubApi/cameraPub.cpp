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

namespace CameraPub
{
    static int runImg = -1;
    static int runLed = -1;
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
            runImg = -1;
            runLed = -1;
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

    void on_publish(struct mosquitto *mosq, void *obj, int mid)
    {
        std::lock_guard<std::mutex> lock(mutex);
        runImg = 0;
        runLed = 0;
    }

    void cameraPubImage(const std::string &imgName, const std::vector<uint8_t> &buffer)
    {
        int rc;
        struct mosquitto *mosq = NULL;
        std::string topic = "camera/webcam";

        signal(SIGINT, handle_sigint);
        signal(SIGSEGV, handle_sigint);

        mosquitto_lib_init();
        mosq = mosquitto_new("cameraImage", true, NULL);
        if (mosq == NULL)
        {
            log(__LINE__, rc, "Error create mosquitto");
            throw;
        }

        std::string willMsg = "cameraPub.cpp | Client disconnected unexpectedly";
        rc = mosquitto_will_set(mosq, topic.c_str(), willMsg.length(), willMsg.c_str(), 1, 0);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            log(__LINE__, rc, "Error");
            throw;
        }

        mosquitto_connect_callback_set(mosq, on_connect);
        mosquitto_publish_callback_set(mosq, on_publish);
        mosquitto_disconnect_callback_set(mosq, on_disconnect);

        rc = mosquitto_connect(mosq, "0.0.0.0", 1883, 60);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            std::cerr << "Mosquitto loop error: " << mosquitto_strerror(rc) << std::endl;
        }

        nlohmann::json j;
        j["image_name"] = imgName;
        j["image_data"] = buffer;
        j["status"] = 1;
        std::string data = j.dump();
        std::this_thread::sleep_for(std::chrono::seconds(1));

        while (runImg == -1)
        {
            int mp = mosquitto_publish(mosq, NULL, topic.c_str(), data.length(), data.c_str(), 1, true);
            std::this_thread::sleep_for(std::chrono::seconds(1));
            if (mp == 0)
                break;
        }

        mosquitto_destroy(mosq);
        mosquitto_lib_cleanup();
    }

    void cameraPubLed()
    {
        int rc;
        struct mosquitto *mosq = NULL;
        std::string topic = "camera/webcam";

        signal(SIGINT, handle_sigint);
        signal(SIGSEGV, handle_sigint);

        mosquitto_lib_init();
        mosq = mosquitto_new("cameraLed", true, NULL);
        if (mosq == NULL)
        {
            log(__LINE__, rc, "Error create mosquitto");
            throw;
        }

        std::string willMsg = "cameraPub.cpp | Client disconnected unexpectedly";
        rc = mosquitto_will_set(mosq, topic.c_str(), willMsg.length(), willMsg.c_str(), 1, 0);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            log(__LINE__, rc, "Error");
            throw;
        }

        mosquitto_connect_callback_set(mosq, on_connect);
        mosquitto_publish_callback_set(mosq, on_publish);
        mosquitto_disconnect_callback_set(mosq, on_disconnect);

        rc = mosquitto_connect(mosq, "192.168.200.9", 1883, 60);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            std::cerr << "Mosquitto loop error: " << mosquitto_strerror(rc) << std::endl;
        }

        nlohmann::json j;
        j["status"] = 1;
        std::string data = j.dump();
        std::this_thread::sleep_for(std::chrono::seconds(1));

        while (runLed == -1)
        {
            int mp = mosquitto_publish(mosq, NULL, topic.c_str(), data.length(), data.c_str(), 1, true);

            std::this_thread::sleep_for(std::chrono::seconds(1));
            if (mp == 0)
                break;
        }

        mosquitto_destroy(mosq);
        mosquitto_lib_cleanup();
    }
};