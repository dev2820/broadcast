export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type StructuredClonable =
  | Array<StructuredClonable>
  | ArrayBuffer
  | Boolean
  | boolean
  | Number
  | number
  | DataView
  | Date
  | Error
  | Map<StructuredClonable, StructuredClonable>
  | Object
  | RegExp
  | Set<StructuredClonable>
  | String
  | string
  | TypedArray;

export type Message = StructuredClonable[] | StructuredClonable;

export default Message;
