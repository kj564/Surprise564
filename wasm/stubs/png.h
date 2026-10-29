#pragma once
#include <cstdio>
#include <cstring>
typedef void* png_structpp;
typedef void* png_structp;
typedef void* png_infop;
typedef void* png_bytep;
typedef void* png_voidp;
typedef png_infop* png_infopp;
typedef png_structp* png_structpp;
typedef unsigned int png_uint_32;
typedef unsigned int png_size_t;
typedef unsigned char png_byte;
#define PNG_LIBPNG_VER_STRING "1.6"
inline png_structp png_create_read_struct(const char*, void*, void*, void*) { return 0; }
inline png_infop png_create_info_struct(png_structp) { return 0; }
inline void png_destroy_read_struct(png_structpp, png_infopp, png_infopp) {}
inline void png_set_read_fn(png_structp, void*, void(*)(png_structp, png_bytep, png_size_t)) {}
inline void* png_get_io_ptr(png_structp) { return 0; }
inline void png_read_info(png_structp, png_infop) {}
inline void png_get_IHDR(png_structp, png_infop, png_uint_32*, png_uint_32*, int*, int*, int*, int*, int*) {}
inline void png_set_strip_16(png_structp) {}
inline void png_set_packing(png_structp) {}
inline void png_read_image(png_structp, png_bytep*) {}
inline void png_read_end(png_structp, png_infop) {}
