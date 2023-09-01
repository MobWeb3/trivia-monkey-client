import axios from 'axios';

export class SpinWheelScene extends Phaser.Scene {

    // the spinning wheel
    wheel?: Phaser.GameObjects.Sprite;
    // can the wheel spin?
    canSpin?: boolean;
    // slices (prizes) placed in the wheel
    slices = 8;
    // prize names, starting from 12 o'clock going clockwise
    slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
    // the prize you are about to win
    prize?: number;
    // text field where to show the prize
    prizeText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "SpinWheelScene" });
    }

    preload() {
        this.load.image("wheel", "assets/sprites/wheel.png");
        this.load.image("pin", "assets/sprites/pin.png");

    }

    create() {
        this.setupSpinWheel();

        const backButton = this.add.text(20, 20, 'Back', { color: 'white', fontSize: '20px ' });
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.switch('Bootstrap').sleep("SpinWheelScene"));
    }

    // function to spin the wheel
    spin() {
        // can we spin the wheel?
        if (this.canSpin) {
            // resetting text field
            this.prizeText?.setText("");
            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(2, 4);
            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);
            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            this.prize = this.slices - 1 - Math.floor(degrees / (360 / this.slices));
            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;
            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            var spinTween = this.tweens.add({
                targets: this.wheel,
                angle: 360 * rounds + degrees,
                ease: 'Cubic.easeOut',
                duration: 3000,
                onComplete: this.winPrize,
                callbackScope: this
            });
        }
    }

    // function to assign the prize
    winPrize() {
        // now we can spin the wheel again
        this.canSpin = true;
        // writing the prize you just won
        if (this.prize)
            this.prizeText?.setText( this.slicePrizes[this.prize]);
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
        this.prizeText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY / 2 - 100, "not spinned", { align: 'center' });
        // setting text field registration point in its center
        this.prizeText.setOrigin(0.5);
        // aligning the text to center
        this.prizeText.setAlign('center');
        // the game has just started = we can spin the wheel
        this.canSpin = true;
        // waiting for your input, then calling "spin" function
        this.input.on('pointerdown', this.spin, this);
    }

}