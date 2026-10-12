# Pocket Edition 2013 — Reference Notes

This directory records metadata about the upstream archive and contains a separate, independently written study project.

## Reference source

- [Upstream directory](https://github.com/M2noa/MCLCE-Archive/tree/master/pocket-edition-2013)
- [Upstream README](https://github.com/M2noa/MCLCE-Archive/blob/master/pocket-edition-2013/README.md)

The upstream repository does not declare a clear redistribution license for the archived source and describes it as leaked code. For that reason, this repository does not mirror its source or proprietary assets. The sibling `mcpe-source` folder is a clean-room C++ learning project and is not Minecraft code.

## Build the independent prototype

From this directory:

    cd mcpe-source
    cmake -S . -B build
    cmake --build build
    ctest --test-dir build --output-on-failure

See [mcpe-source/README.md](mcpe-source/README.md) for features, commands, and current limitations.
