cmake_minimum_required(VERSION 3.16)
project(PocketEngineStudy VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_library(pocket_core
    handheld/src/world.cpp
    handheld/src/game.cpp
)
target_include_directories(pocket_core PUBLIC handheld/src)

if(MSVC)
    target_compile_options(pocket_core PRIVATE /W4 /permissive-)
else()
    target_compile_options(pocket_core PRIVATE -Wall -Wextra -Wpedantic)
endif()

add_executable(pocket_engine_study handheld/src/main.cpp)
target_link_libraries(pocket_engine_study PRIVATE pocket_core)

include(CTest)
if(BUILD_TESTING)
    add_executable(pocket_engine_tests tests/world_tests.cpp)
    target_link_libraries(pocket_engine_tests PRIVATE pocket_core)
    add_test(NAME pocket_engine_tests COMMAND pocket_engine_tests)
endif()
