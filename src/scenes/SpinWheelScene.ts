
import { getHostId, getSession, updateInitialTurnPosition } from '../polybase/SessionHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { ChannelHandler } from '../ably/ChannelHandler';
import { Types } from 'ably';
import { sendMessage } from '../utils/MessageListener';
import { Messages } from '../utils/Messages';


export class SpinWheelScene extends Phaser.Scene {

    // the spinning wheel
    wheel?: Phaser.GameObjects.Sprite;
    // can the wheel spin?
    canSpin = false;
    // slices (prizes) placed in the wheel
    slices = 12;
    // prize names, starting from 12 o'clock going clockwise
    sliceValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12];
    // the prize you are about to win
    selectedSlice?: number;
    // text field where to show the prize
    messageGameText?: Phaser.GameObjects.Text;

    sessionId?: string;
    channelId?: string;
    clientId?: string;
    currentPhase?: string;
    channel?: Types.RealtimeChannelPromise;
    isHost?: boolean = false;
    name?: string;
    initialTurnPositions?: any;
    numberPlayers?: number;
    gamePhase?: string;

    constructor() {
        super({ key: "SpinWheelScene" });
    }

    init(data: any) {
        if (data) {
            this.channelId = data.channelId
            this.sessionId = data.sessionId;
            this.clientId = data.clientId;
            this.name = data.name;
        }
    }

    async preload() {
        this.load.image("wheel", "assets/sprites/wheel2.png");
        this.load.image("pin", "assets/sprites/pin.png");
    }

    async create() {
        // console.log("SpinWheelScene data: ", this.data);
        await this.setupSessionData();
        this.setupSpinWheel();



        if (this.channelId && this.clientId) {
            const channelHandler = await new ChannelHandler().initChannelHandler(this.clientId);
            await channelHandler?.enterChannel({ channelId: this.channelId, clientId: this.clientId, nickname: this.name});
            this.channel = ChannelHandler.ablyInstance?.ablyInstance.channels.get(this.channelId);
            // console.log('HERE channelId: ', this.channelId);
            // console.log('HERE channel: ', this.channel);
            if(this.isHost) {
                console.log ("subscribing to turn-selected");
                this.channel?.subscribe('turn-selected', async (message) => {
                    console.log('turn selected by: ', message.clientId);
                    const { initialTurnPosition } = await getSession({ id: this.sessionId });
                    this.initialTurnPositions = initialTurnPosition;
                    // console.log('initialTurnPositions: ', initialTurnPosition);
                    // console.log('numberPlayers: ', this.numberPlayers);

                    const initialTurnPositionLength = Object.keys(initialTurnPosition).length;
                    const canStartGame = this.numberPlayers &&
                    initialTurnPositionLength >= this.numberPlayers;

                    // console.log('canStartGame: ', canStartGame);
                    // check if all other players have already selected their turn. To do this we must check the length of 
                    // initialTurnPosition in the Polybase server
                    if (canStartGame) {
                        // console.log('GAME_ACTIVE!');
                        sendMessage(Messages.MAY_START_GAME, { sessionId: this.sessionId });
                    }
                });
            }

        }
    }

    async setupBackButton() {
        const backButton = this.add.text(20, 20, 'Back', { color: 'white', fontSize: '20px ' });
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.switch('Bootstrap');
        });
    }


    async setupSessionData() {
        const session = await getSession({ id: this.sessionId });

        if (!session) {
            console.log('session not initialized yet');
            this.messageGameText?.setText( "session not initialized yet" );
            return;
        }
        const { initialTurnPosition, numberPlayers, gamePhase } = session;
    
        
        this.gamePhase = gamePhase ?? {};
    
        // console.log('gamePhase: ', this.gamePhase);
        // console.log('gamePhase in preload: ', this.gamePhase);
        if ( this.gamePhase === SessionPhase.TURN_ORDER){
            this.canSpin = true;
        } 
        
        const isHost = await getHostId({ id: this.sessionId }) === this.clientId;
        if (isHost) this.isHost = true;
        if (initialTurnPosition) this.initialTurnPositions = initialTurnPosition;
        if (numberPlayers) this.numberPlayers = numberPlayers;

    }

     // function to spin the wheel
     spin() {
        // can we spin the wheel?
        if (this.canSpin) {
            // resetting text field
            this.messageGameText?.setText("");
            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(2, 4);
            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 1000) % 360;
            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            this.selectedSlice = this.sliceValues[this.slices - 1 - Math.floor(degrees / (360 / this.slices))];
            // console.log("prize: ", this.selectedSlice);
            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;
            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({
                targets: this.wheel,
                angle: 360 * rounds + degrees,
                ease: 'Cubic.easeOut',
                duration: 3000,
                onComplete: this.handleSelectedSlice,
                callbackScope: this
            });
        }
    }

    // function to assign the prize
    async handleSelectedSlice() {
        // now we can only spin once
        this.canSpin = false;
        // writing the prize you just won
        if (this.selectedSlice)
            this.messageGameText?.setText( this.selectedSlice.toString() );

        // report to our polybase server our turn position.
        await updateInitialTurnPosition({ initialTurnPosition: this.selectedSlice, id: this.sessionId, clientId: this.clientId});

        // report through ably that we are done choosing our turn.
        await this.channel?.publish('turn-selected', { turn: this.selectedSlice });

    }

    setupSpinWheel() {

        // giving some color to background
        this.cameras.main.setBackgroundColor('#880041');
        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "wheel");        // setting wheel registration point in its center
        this.wheel.setOrigin(0.5);
        this.wheel.setScale(0.75);
        // adding the pin in the middle of the canvas
        var pin = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "pin");
        // setting pin registration point in its center
        pin.setOrigin(0.5);
        // adding the text field
        this.messageGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY / 2 - 100, "not spinned", { align: 'center' });
        // setting text field registration point in its center
        this.messageGameText.setOrigin(0.5);
        // aligning the text to center
        this.messageGameText.setAlign('center');
        // waiting for your input, then calling "spin" function
        this.input.on('pointerdown', this.spin, this);
    }

}