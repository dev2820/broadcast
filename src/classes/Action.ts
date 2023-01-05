import Message from "@/types/Message";

export default class Action {
  type: string;
  payload?: Message;
  constructor(type: string, payload?: Message) {
    this.type = type;
    this.payload = payload;
  }
  static isAction(target: any) {
    if (typeof target.type !== "string") return false;

    return true;
  }
}
