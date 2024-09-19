cmake_minimum_required(VERSION 3.9)
project(applications)

set(CMAKE_CXX_STANDARD 17)
set(JSON_LIBS ./3rdParty/json)
set(MOSQUITTO_LIBS ./3rdParty/mosquitto)

include_directories(
    ${JSON_LIBS}/include
    ${MOSQUITTO_LIBS}
    ${MOSQUITTO_LIBS}/lib
    ${MOSQUITTO_LIBS}/lib/cpp
    ${MOSQUITTO_LIBS}/include
    /usr/include/opencv4/
)

link_directories(
    ${MOSQUITTO_LIBS}/lib/cpp
)

add_subdirectory(
    3rdParty
)

add_executable(${PROJECT_NAME}
    "main.cpp"
)
target_link_libraries(${PROJECT_NAME}
    ssl
    crypto
    pthread
    nlohmann_json::nlohmann_json
    mosquittopp
    wiringPi
    wiringPiDev
)

add_executable(camera_app
    "CameraApp/CameraApp.cpp"
)
target_link_libraries(camera_app
    ssl
    crypto
    pthread
    nlohmann_json::nlohmann_json
    mosquittopp
    opencv_imgcodecs
    opencv_core
    opencv_highgui
    opencv_videoio
    opencv_video
    opencv_imgproc
    opencv_objdetect
    opencv_tracking
)

add_executable(led_app
    "LedApp/LedApp.cpp"
)
target_link_libraries(led_app
    ssl
    crypto
    pthread
    nlohmann_json::nlohmann_json
    mosquittopp
    wiringPi
    wiringPiDev
)

add_executable(system_status_app
    "SystemStatusApp/SystemStatusApp.cpp"
)
target_link_libraries(system_status_app
    ssl
    crypto
    pthread
    nlohmann_json::nlohmann_json
    mosquittopp
    wiringPi
    wiringPiDev
)
