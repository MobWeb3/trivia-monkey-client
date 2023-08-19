import { BaseScene } from "./shared/BaseScene";

export class PlayScene extends BaseScene {

    constructor() {
        super({ key: "PlayScene" });
    }

    preload() {
        this.load.image('face', 'assets/play_loading_scene.png');

    }

    create() {
        super.create();
        const gameConfigWidth = this.game.config.width as number;

        const sprite = this.add.sprite(0, 0, 'face');
        const scaleX = gameConfigWidth / sprite.displayWidth;
        const scaleY = this.game.config.height as number / sprite.displayHeight;
        const scale = Math.min(scaleX, scaleY);
        sprite.setScale(scale);

        // Set the origin of the sprite to the center
        sprite.setOrigin(0.5);

        // Position the sprite in the center of the screen
        const x = gameConfigWidth / 2;
        const y = this.sys.game.config.height as number / 3;
        sprite.setPosition(x, y);


        const { width, height } = this.scale

        this.createButtons(width, height)
    }

    private readonly BUTTON_WIDTH = 150
    private readonly BUTTON_HEIGHT = 50

    createButtons(width: number, height: number) {
        const buttonData = [
            { text: 'Create Game', yOffset: 0 },
            { text: 'Join Game', yOffset: this.BUTTON_HEIGHT + 10 },
        ]

        const bottomMargin = 100;
        const totalButtonHeight = (this.BUTTON_HEIGHT + 10) * buttonData.length - 10;

        buttonData.forEach(({ text, yOffset }, index) => {
            const buttonX = width * 0.5
            const buttonY = height - bottomMargin - totalButtonHeight + yOffset

            const button = this.add.image(buttonX, buttonY, 'glass-panel')
                .setDisplaySize(this.BUTTON_WIDTH, this.BUTTON_HEIGHT)

            this.add.text(buttonX, buttonY, text).setOrigin(0.5)

            this.buttons.push(button)
        })
    }

    addEventListeners() {
        this.buttons.forEach((button, index) => {
            button.setInteractive()
            button.on('pointerdown', () => {
                this.selectButton(index)
                this.confirmSelection()
            })
        })

        this.buttons[0].on('selected', () => {
            console.log('Create Game')
            // this.game.scene.start('PlayScene', PlayScene);
            this.scene.stop('Bootstrap').launch('PlayScene');
        })

        this.buttons[1].on('selected', () => {
            console.log('Join Game')
        })

    }

}