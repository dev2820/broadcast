import Packet from "@/classes/Packet";

export default interface Broadcastable {
  /**
   * @description Broadcastable can dispatch packet, if sending is success, then return true
   * @param {Packet} packet Broadcastable can only dispatch packet
   * @returns {boolean} if dispatch is success, then return true
   */
  broadcast(packet: Packet): void;
}
