export default interface Store {
  [key: string]: any;
  $dispatch: Function;
  $state: {
    [key: string]: any;
  };
}
