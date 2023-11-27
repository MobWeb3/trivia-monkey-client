// spacesSingleton.js
import Spaces from '@ably/spaces';
import { Realtime } from 'ably';

let spacesInstance: Spaces | null = null;

export function getSpacesInstance(clientId: string) {
  if (!spacesInstance) {
    spacesInstance = new Spaces(new Realtime.Promise({
      key: import.meta.env.VITE_APP_ABLY_API_KEY ?? "",
      clientId: clientId
    }));
  }
  return spacesInstance;
}
