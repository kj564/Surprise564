#pragma once
#define JNI_VERSION_1_4 0x00010004
#define JNI_OK 0
#define JNI_FALSE 0
#define JNI_TRUE 1
typedef void JNIEnv;
struct JavaVM { int GetEnv(void**, int) { return 0; } int AttachCurrentThread(void**) { return 0; } int DetachCurrentThread() { return 0; } };
typedef int jint;
typedef void* jobject;
typedef void* jclass;
typedef void* jstring;
typedef void* jintArray;
typedef void* jbyteArray;
typedef void* jthrowable;
typedef void* jmethodID;
typedef void* jfieldID;
