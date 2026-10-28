#include <string>

namespace RakNet {
    struct SystemAddress {
        SystemAddress();
        SystemAddress(unsigned int);
        const char* ToString(bool) const;
        bool operator==(const SystemAddress&) const;
    };
    
    struct RakNetGUID {
        RakNetGUID();
        RakNetGUID(unsigned long long);
        bool operator==(const RakNetGUID&) const;
    };
}

// §Constructor definitions — must be out-of-line for wasm-ld to find them
RakNet::SystemAddress::SystemAddress() {}
RakNet::SystemAddress::SystemAddress(unsigned int) {}
const char* RakNet::SystemAddress::ToString(bool) const { return "0.0.0.0:0"; }
bool RakNet::SystemAddress::operator==(const RakNet::SystemAddress&) const { return false; }

RakNet::RakNetGUID::RakNetGUID() {}
RakNet::RakNetGUID::RakNetGUID(unsigned long long) {}
bool RakNet::RakNetGUID::operator==(const RakNet::RakNetGUID&) const { return false; }
