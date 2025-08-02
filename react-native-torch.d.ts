declare module 'react-native-torch' {
  export function switchState(turnOn: boolean): void;
  export function checkAvailability(): Promise<boolean>;
}
