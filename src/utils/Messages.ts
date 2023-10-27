/**
 * Messages used to trigger events
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
    MAY_START_GAME = 'MayStartGame',
    START_GAME_AI = 'start-game-ai',
    TURN_COMPLETED = 'turn-completed',
    SHOW_QUESTION = 'show-question',
    HIDE_QUESTION = 'hide-question',
  }
