import Broadcastable from "../interfaces/Broadcastable";
import ChannelAddress from "../types/ChannelAddress";
import Packet from "./Packet";

export default abstract class CommunicationDevice implements Broadcastable {
  #sender: BroadcastChannel;
  #receiver: BroadcastChannel;

  constructor(address: ChannelAddress) {
    this.#sender = new BroadcastChannel(address.sender);
    this.#receiver = new BroadcastChannel(address.receiver);
    this.#receiver.onmessage = this.#handleMessage.bind(this);
  }
  broadcast(packet: Packet): void {
    this.#sender.postMessage(packet);
  }
  #handleMessage(evt: MessageEvent) {
    const packet = evt.data;

    if (!Packet.isPacket(packet)) return;

    this.handlePacket(packet);
  }

  protected abstract handlePacket(packet: Packet): void;
}
