cmake_minimum_required(VERSION 3.16)
project(PocketEngineStudy LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(pocket_engine_study handheld/src/main.cpp)
target_include_directories(pocket_engine_study PRIVATE handheld/src)
