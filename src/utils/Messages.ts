/**
 * Messages between Phaser and React
 * 
 */
export enum Messages {
    TRY_CONNECTION = 'TryConnection',
    TRY_DISCONNECT = 'TryDisconnect',
    IS_CONNECTED = 'IsConnected',
    IS_DISCONNECTED = 'IsDisconnected',
    CREATE_CHANNEL = 'CreateChannel',
    CHANNEL_CREATED = 'ChannelCreated',
    ENTER_CHANNEL = 'EnterChannel',
    CHANNEL_JOINED = 'ChannelJoined',
    ALL_PLAYERS_JOINED = 'AllPlayersJoined',
  }
