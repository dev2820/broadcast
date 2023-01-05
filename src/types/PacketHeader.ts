import PACKET_TYPES from "@/constants/PACKET_TYPES";

type PacketType = typeof PACKET_TYPES[number];

type PacketHeader = {
  type: PacketType;
};

export default PacketHeader;
