
import { getSession } from '../polybase/SessionHandler';
import { Types } from 'ably';

export class AIGameScene extends Phaser.Scene {

    // the spinning wheel
    wheel?: Phaser.GameObjects.Sprite;
    // can the wheel spin?
    canSpin = false;
    // slices (prizes) placed in the wheel
    slices = 12;
    // prize names, starting from 12 o'clock going clockwise
    sliceValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    // the prize you are about to win
    selectedSlice?: number;
    // text field where to show the prize
    messageGameText?: Phaser.GameObjects.Text;

    sessionId?: string;
    channelId?: string;
    clientId?: string;
    name?: string;
    channel?: Types.RealtimeChannelPromise;

    constructor() {
        super({ key: "AIGameScene" });
    }

    init() {
        this.channelId = this.data.get('channelId');
        this.sessionId = this.data.get('sessionId');
        this.clientId = this.data.get('clientId');
        this.name = this.data.get('name');


    }

    async preload() {
        this.load.image("wheel", "assets/sprites/wheel2.png");
        this.load.image("pin", "assets/sprites/pin.png");
    }

    async create() {
        await this.setupSessionData();
        this.setupBackButton();

        // Load the spinner wheel
        this.setupSpinWheel();

        // // Load the question box (hidden by default)
        // this.setupQuestionBox();

        // // Load the answer input (hidden by default)
        // this.setupAnswerInput();

        // // Load the submit button (hidden by default)
        // this.setupSubmitButton();


    }

    async setupBackButton() {
        const backButton = this.add.text(20, 20, 'Back', { color: 'white', fontSize: '20px ' });
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.switch('Bootstrap');
        });
    }


    async setupSessionData() {
        const { gamePhase, initialTurnPosition, numberPlayers } = await getSession({ id: this.sessionId });

        console.log('gamePhase: ', gamePhase);
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
        }
    }

    // function to assign the prize
    async handleSelectedSlice() {
        // now we can only spin once
        this.canSpin = false;
        // writing the prize you just won
        if (this.selectedSlice)
            this.messageGameText?.setText(this.selectedSlice.toString());

        // report to our polybase server next player is up.


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