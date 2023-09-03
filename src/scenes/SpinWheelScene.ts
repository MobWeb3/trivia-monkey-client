
import { BASE_URL } from '../MonkeyTriviaServiceConstants';
import { getHostId, getSessionPhase, updateInitialTurnPosition } from '../polybase/SessionHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { ChannelHandler } from '../ably/ChannelHandler';
import { Types } from 'ably';
const POLYBASE_URL = `${BASE_URL}/api/polybase`;


export class SpinWheelScene extends Phaser.Scene {

    // the spinning wheel
    wheel?: Phaser.GameObjects.Sprite;
    // can the wheel spin?
    canSpin?: boolean;
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

    constructor() {
        super({ key: "SpinWheelScene" });
    }

    async preload() {
        this.channelId = this.data.get('channelId');
        this.sessionId = this.data.get('sessionId');
        this.clientId = this.data.get('clientId');
        this.name = this.data.get('name');
        this.load.image("wheel", "assets/sprites/wheel2.png");
        this.load.image("pin", "assets/sprites/pin.png");
        const {phase} = await getSessionPhase({ id: this.sessionId });
        if ( phase === SessionPhase.TURN_ORDER) this.canSpin = true;
        const isHost = await getHostId({ id: this.sessionId }) === this.clientId;
        if (isHost) this.isHost = true;
        console.log('isHost: ', this.isHost);
    }

    async create() {

        console.log("SpinWheelScene data: ", this.data.list);
        
        // console.log("sessionId: ", this.sessionId);
        this.setupSpinWheel();

        const backButton = this.add.text(20, 20, 'Back', { color: 'white', fontSize: '20px ' });
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.switch('Bootstrap');
        });

        if (this.channelId && this.clientId && this.name) {
            const channelHandler = await new ChannelHandler().initChannelHandler(this.clientId);
            await channelHandler?.enterChannel({ channelId: this.channelId, clientId: this.clientId, nickname: this.name});
            this.channel = ChannelHandler.ablyInstance?.ablyInstance.channels.get(this.channelId);
            console.log('HERE: ', this.channelId);
            if(this.isHost && this.channel) {
                this.channel.subscribe('turn-selected', async (message) => {
                    console.log('turn selected by: ', message.clientId);
                });
            }

        }
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
            console.log("prize: ", this.selectedSlice);
            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;
            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            var spinTween = this.tweens.add({
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
    handleSelectedSlice() {
        // now we can only spin once
        this.canSpin = false;
        // writing the prize you just won
        if (this.selectedSlice)
            this.messageGameText?.setText( this.selectedSlice.toString() );

        // report to our polybase server our turn position.
        updateInitialTurnPosition({ initialTurnPosition: this.selectedSlice, id: this.sessionId, clientId: this.clientId});

        // report through ably that we are done choosing our turn.
        this.channel?.publish('turn-selected', { turn: this.selectedSlice });

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
        // we can spin while the TURN_ORDER phase is active
        this.canSpin = false;
        // waiting for your input, then calling "spin" function
        this.input.on('pointerdown', this.spin, this);
    }

}