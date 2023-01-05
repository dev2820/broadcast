import Action from "./Action";
import PacketHeader from "../types/PacketHeader";
import Message from "../types/Message";
import * as PACKET_TYPE from "../constants/PACKET_TYPES";
export default class Packet {
  header: PacketHeader;
  payload?: Action | Message;
  constructor(header: PacketHeader, payload?: Action | Message) {
    this.header = header;
    this.payload = payload;
  }

  static isPacket(target: any) {
    if (!target.header) return false;
    if (typeof target.header.type !== "number") return false;

    return true;
  }
  static DISCOVER = new Packet({ type: PACKET_TYPE.DISCOVER });
}
