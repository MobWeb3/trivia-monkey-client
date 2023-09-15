
import { getHostId, getNextTurnPlayerId, getSession } from '../polybase/SessionHandler';
import { SessionPhase } from '../game-domain/SessionPhase';
import { Types } from 'ably';
import { publishTurnCompleted, suscribeToTurnCompleted } from '../ably/AblyMessages';
import { Messages } from '../utils/Messages';


export class AIGameScene extends Phaser.Scene {

    // the spinning wheel
    wheel?: Phaser.GameObjects.Sprite;
    wheelContainer?: Phaser.GameObjects.Container;
    // can the wheel spin?
    canSpin?: boolean;
    // slices (prizes) placed in the wheel
    slices = 8;
    // prize names, starting from 12 o'clock going clockwise
    sliceValues?: string[];
    // the prize you are about to win
    selectedSlice?: string;
    // text field where to show the prize
    messageGameText?: Phaser.GameObjects.Text;

    currentTurnPlayerId?: string;


    playerInTurnAvatar?: Phaser.GameObjects.Sprite;
    // Text objects for displaying player in turn avatar and time left
    playerInTurnAvatarText?: Phaser.GameObjects.Text;

    timeLeft: number = 20; // 20 seconds
    timerText?: Phaser.GameObjects.Text;

    timeLeftText?: Phaser.GameObjects.Text;

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
            console.log("AIGameScene init data: ", data);
            this.channelId = data.channelId
            this.sessionId = data.sessionId;
            this.clientId = data.clientId;
            this.name = data.name;
        }
    }

    async preload() {
        this.load.image("wheel", "assets/sprites/wheel.png");
        this.load.image("pin", "assets/sprites/pin.png");
        this.load.image("player", "assets/sprites/monkey-avatar.png");
    }

    async create() {
        console.log("AIGameScene create data: ", this.data);
        await this.setupSessionData();
        this.setupSpinWheel();
        if (this.clientId && this.channelId){
            suscribeToTurnCompleted(this.clientId, this.channelId);
        }

        window.addEventListener(Messages.TURN_COMPLETED, () => {
                console.log("AIGameScene TURN_COMPLETED");
                this.updateTurn();
        });
        // Add timer text to the scene
        this.timerText = this.add.text(10, 50, `Time left: ${this.timeLeft}`, { fontSize: '16px', color: '#fff' });
        // Start the timer
        this.time.addEvent({
            delay: 1000, // 1000 ms = 1 second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    async updateTurn() {
        await this.setupSessionData();
        this.setupPlayerInTurnAvatar();
    }

    shutdown() {
        window.removeEventListener(Messages.TURN_COMPLETED, this.updateTurn.bind(this));
    }

    updateTimer() {
        this.timeLeft--; // Decrease the time left
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            // Stop the game or do something else when the time is up
        }
        // Update the timer text
        this.timerText?.setText(`Time left: ${this.timeLeft}`);
    }

    isPlayerTurn(): boolean {
        if (!this.clientId || !this.currentTurnPlayerId)
            return false;
        return this.clientId === this.currentTurnPlayerId;
    }

    async setupSessionData() {
        // Get session data
        const session = await getSession({ id: this.sessionId });
        if (!session) {
            console.log('session not initialized yet');
            this.messageGameText?.setText("session not initialized yet");
            return;
        }
        const { numberPlayers, gamePhase, topics, currentTurnPlayerId} = session;

        // Get topics
        this.sliceValues = topics;
        this.gamePhase = gamePhase ?? {};

        // Check if game is active
        if (this.gamePhase !== SessionPhase.GAME_ACTIVE) {
            console.log('Game is not active!');
            // tell page to show that game has not started yet or is over.
            return;
        }

        // On load check if player is up for turn
        this.currentTurnPlayerId = currentTurnPlayerId;
        // adding the text field
        this.messageGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY / 2 - 100, "", { align: 'center' });
        // setting text field registration point in its center
        this.messageGameText.setOrigin(0.5);
        // aligning the text to center
        this.messageGameText.setAlign('center');
        if (this.isPlayerTurn()) {
            this.canSpin = true;
            this.messageGameText?.setText("Your turn!");
        } else {
            this.canSpin = false;
            this.messageGameText?.setText(`Waiting for ${currentTurnPlayerId} to finish turn...`);
        }

        const isHost = await getHostId({ id: this.sessionId }) === this.clientId;
        if (isHost) this.isHost = true;
        if (numberPlayers) this.numberPlayers = numberPlayers;
    }

    // function to spin the wheel
    spin() {
        // can we spin the wheel?
        if (this.canSpin && this.isPlayerTurn()) {
            // resetting text field
            this.messageGameText?.setText("");
            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(2, 4);
            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 1000) % 360;
            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            if (this.sliceValues)
                this.selectedSlice = this.sliceValues[this.slices - 1 - Math.floor(degrees / (360 / this.slices))];
            console.log("prize: ", this.selectedSlice);
            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;
            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({
                targets: this.wheelContainer,
                angle: 360 * rounds + degrees,
                ease: 'Cubic.easeOut',
                duration: 3000,
                onComplete: this.handleSelectedSlice,
                callbackScope: this
            });

            // Update turn on polybase
            getNextTurnPlayerId({id: this.sessionId});

            // Publish turn completed // we know clientId is not null because we checked isPlayerTurn
            if(this.clientId && this.channelId) {
                publishTurnCompleted(this.clientId, this.channelId);
            }   
        }
    }

    // function to assign the prize
    async handleSelectedSlice() {
        // writing the prize you just won
        if (this.selectedSlice)
            this.messageGameText?.setText(this.selectedSlice.toString());
    }

    setupSpinWheel() {
        this.wheelContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50);


        // giving some color to background
        this.cameras.main.setBackgroundColor('#880041');
        // adding the wheel in the middle of the canvas
        // this.wheel = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "wheel");        // setting wheel registration point in its center
        this.wheel = this.add.sprite(0, 0, "wheel");
        this.wheel.setOrigin(0.5);
        this.wheel.setScale(0.75);
        // Add the wheel to the container
        this.wheelContainer?.add(this.wheel);

        if (this.sliceValues) {

            // Add the sprites (slice names) to the container
            for (let i = 0; i < this.slices; i++) {
                let sliceAngle = (360 / this.slices) * (Math.PI / 180);
                // let angle = (360 / this.slices) * i * (Math.PI / 180)- Math.PI / 2; // Calculate the rotation angle in radians
                // let angle = sliceAngle * i - Math.PI / 2 + sliceAngle / 2; // Add half the slice angle to the rotation
                let angle = sliceAngle * i - Math.PI / 2 + sliceAngle / 2; // Add half the slice angle to the rotation

                let radius = this.wheel.displayHeight / 2; // The radius of the wheel
                let x = radius * Math.cos(angle); // Calculate the x coordinate
                let y = radius * Math.sin(angle); // Calculate the y coordinate

                let sprite = this.add.text(x, y, this.sliceValues[i], { align: 'center' });
                sprite.setOrigin(0.5);
                sprite.setRotation(angle + Math.PI / 2); // Rotate the sprite to its position
                this.wheelContainer.add(sprite);
            }
        }

        // adding the pin in the middle of the canvas
        var pin = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "pin");
        // setting pin registration point in its center
        pin.setOrigin(0.5);

        // waiting for your input, then calling "spin" function
        this.input.on('pointerdown', this.spin, this);

        this.setupPlayerInTurnAvatar();
    }

    setupPlayerInTurnAvatar() {
        this.playerInTurnAvatar = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200, "player");
        this.playerInTurnAvatar.setOrigin(0.5);
        this.playerInTurnAvatar.setScale(0.25);

        this.playerInTurnAvatarText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200 + this.playerInTurnAvatar.displayHeight, "Player: " + this.currentTurnPlayerId + " turn", { fontSize: '16px', color: '#fff' });
        this.playerInTurnAvatarText.setOrigin(0.5);
    }

}