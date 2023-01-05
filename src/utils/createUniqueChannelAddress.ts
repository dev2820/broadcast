import CHANNEL_ADDRESS_POSTFIX from "@/constants/CHANNEL_ADDRESS_POSTFIX";
import ChannelAddress from "@/types/ChannelAddress";

export default function createUniqueChannelAddress(
  key: string
): ChannelAddress {
  const timestamp = Date.now();
  return {
    sender: key + timestamp + CHANNEL_ADDRESS_POSTFIX.SENDER,
    receiver: key + timestamp + CHANNEL_ADDRESS_POSTFIX.RECIVER,
  };
}
