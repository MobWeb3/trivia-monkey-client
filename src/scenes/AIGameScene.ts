
import { getHostId, getSession } from '../polybase/SessionHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { Types } from 'ably';


export class AIGameScene extends Phaser.Scene {

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
        super({ key: "AIGameScene" });
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
        console.log("AIGameScene data: ", this.data);
        await this.setupSessionData();
        this.setupSpinWheel();

        this.setupBackButton();



        if (this.channelId && this.clientId) {                            

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
        const { numberPlayers, gamePhase } = session;
    
        
        this.gamePhase = gamePhase ?? {};
        if ( this.gamePhase === SessionPhase.TURN_ORDER){
            console.log('can turn!');
            this.canSpin = true;
        } 
        
        const isHost = await getHostId({ id: this.sessionId }) === this.clientId;
        if (isHost) this.isHost = true;
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
            console.log("prize: ", this.selectedSlice);
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