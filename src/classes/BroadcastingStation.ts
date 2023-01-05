import CommunicationDevice from "@/classes/CommunicationDevice";
import createUniqueChannelAddress from "@/utils/createUniqueChannelAddress";
import ChannelAddress from "@/types/ChannelAddress";
import Message from "@/types/Message";
import Action from "@/classes/Action";
import Packet from "@/classes/Packet";
import * as PACKET_TYPE from "@/constants/PACKET_TYPES";

export default class BroadcastingStation extends CommunicationDevice {
  #store: Record<string, any>;
  #channelAddress: ChannelAddress;

  constructor(stationName: string, store: Record<string, any>) {
    const channelAddress = createUniqueChannelAddress(stationName);
    super(channelAddress);

    this.#channelAddress = channelAddress;
    this.#store = store;
  }

  get channelAddress(): ChannelAddress {
    return this.#channelAddress;
  }

  protected handlePacket(packet: Packet) {
    switch (packet.header.type) {
      case PACKET_TYPE.DISCOVER: {
        this.#handleDiscover();
        return;
      }
      default: {
        if (!Action.isAction(packet.payload)) return;

        this.#handleAction(packet.payload as Action);
        return;
      }
    }
  }

  #handleDiscover() {
    const currentState: Message = this.#store.$state;
    const response = new Packet({ type: PACKET_TYPE.OFFER }, currentState);
    this.broadcast(response);
  }
  #handleAction(action: Action) {
    const isChanged = this.#store.$dispatch(action);
    if (!isChanged) return;

    const newState: Message = this.#store.$state;
    const response = new Packet({ type: PACKET_TYPE.NEW_STATE }, newState);
    this.broadcast(response);
  }
}
