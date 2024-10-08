#include <unistd.h>
#include <iostream>
#include <filesystem>
#include <string>
#include <ctime>
#include <thread>

#include <opencv2/opencv.hpp>
#include <opencv2/tracking.hpp>
#include <opencv2/core/ocl.hpp>
#include <opencv2/video/background_segm.hpp>
#include "opencv2/imgproc.hpp"
#include "opencv2/highgui.hpp"

#include "../Api/PubApi/cameraPub.cpp"

int main(int argc, char **argv)
{
    cv::VideoCapture cap(0);
    if (!cap.isOpened())
    {
        std::cout << "Cannot open the video camera!!" << std::endl;
        return -1;
    }

    cv::Ptr<cv::BackgroundSubtractorMOG2>
        bg = cv::createBackgroundSubtractorMOG2();

    while (true)
    {
        cv::Mat frame, fgMaskMOG2;
        cap.read(frame);
        cv::resize(frame, frame, cv::Size(cap.get(cv::CAP_PROP_FRAME_WIDTH) / 2, cap.get(cv::CAP_PROP_FRAME_HEIGHT)) / 2, cv::INTER_LINEAR);
        if (frame.empty())
        {
            std::cout << "LOG | Frame empty | " << __LINE__ << std::endl;
            continue;
        }
        bg->apply(frame, fgMaskMOG2);

        cv::erode(fgMaskMOG2, fgMaskMOG2, cv::getStructuringElement(cv::MORPH_RECT, cv::Size(5, 5)));
        cv::dilate(fgMaskMOG2, fgMaskMOG2, cv::getStructuringElement(cv::MORPH_RECT, cv::Size(5, 5)));
        cv::GaussianBlur(fgMaskMOG2, fgMaskMOG2, cv::Size(5, 5), 0);
        cv::morphologyEx(fgMaskMOG2, fgMaskMOG2, cv::MORPH_CLOSE, cv::getStructuringElement(cv::MORPH_RECT, cv::Size(3, 3)));

        cv::threshold(fgMaskMOG2, fgMaskMOG2, 130, 255, cv::THRESH_BINARY);

        cv::Canny(fgMaskMOG2, fgMaskMOG2, 100, 200);
        std::vector<std::vector<cv::Point>> contours;
        cv::findContours(fgMaskMOG2, contours, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);

        std::vector<cv::Rect> boundRect(contours.size());
        std::vector<std::vector<cv::Point>> contours_poly(contours.size());

        for (size_t i = 0; i < contours.size(); i++)
        {
            cv::approxPolyDP(contours[i], contours_poly[i], 3, true);
            boundRect[i] = cv::boundingRect(contours_poly[i]);
        }

        for (size_t i = 0; i < contours.size(); i++)
        {
            double area = cv::contourArea(contours[i]);
            if (area > 3000)
            {
                cv::drawContours(fgMaskMOG2, contours_poly, (int)i, cv::Scalar(0, 255, 0), 6);
                cv::rectangle(frame, boundRect[i].tl(), boundRect[i].br(), cv::Scalar(0, 255, 0), 2);
                std::cout << "============ Detect!!! ============" << std::endl;
                std::string imgName = std::to_string(time(0)) + ".jpg";
                std::vector<uint8_t> buffer;
                bool success = cv::imencode(".jpg", frame, buffer);
                if (success)
                {
                    CameraPub::cameraPubImage(imgName, buffer);
                    CameraPub::cameraPubLed();
                }
            }
        }
    }

    return 0;
}