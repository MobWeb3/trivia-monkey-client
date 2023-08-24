import { sendMessage } from "../utils/MessageListener";
import { Messages } from "../utils/Messages";

export class CreateGame extends Phaser.Scene {
    text?: Phaser.GameObjects.Text;
    waitingForPlayers?: Phaser.GameObjects.Text;
    boundChannelCreatedListenerHandler: any;

    constructor() {
        super({ key: "CreateGame" });
        this.boundChannelCreatedListenerHandler = this.channelCreatedListenerHandler.bind(this);
    }

    preload() {
        this.load.html('nameform', 'assets/nameform.html');
        this.text = this.add.text(this.cameras.main.width / 4, 10, 'Please enter your name', {
            color: 'white',
            fontSize: '20px',
            wordWrap: { width: this.cameras.main.width, useAdvancedWrap: true }
        });
        this.waitingForPlayers = this.add.text(this.cameras.main.width / 4, 10, 'Waiting for players...', {
            color: 'white',
            fontSize: '20px',
            wordWrap: { width: this.cameras.main.width, useAdvancedWrap: true }
        });
        this.waitingForPlayers?.setVisible(false);
        this.waitingForPlayers?.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 + 4* this.text?.height);
        this.waitingForPlayers?.setOrigin(0.5);
    }

    create() {
        // this.text = 
        this.text?.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 4);
        this.text?.setOrigin(0.5);

        const element = this.add.dom(this.cameras.main.width / 2, 0).createFromCache('nameform');

        element.addListener('click');

        element.on('click', (event: any) => {
            if (event.target.name === 'playButton') {
                const inputText = element.getChildByName('nameField') as HTMLInputElement;
                console.log("inputText: ", inputText);

                //  Have they entered anything?
                if (inputText?.value !== '') {
                    //  Turn off the click events
                    element.removeListener('click');

                    //  Hide the login element
                    element.setVisible(false);

                    this.text?.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
                    this.text?.setOrigin(0.5);
                    sendMessage(Messages.CREATE_CHANNEL, {
                        "nickname": inputText.value,
                    });

                    //  Populate the text with whatever they typed in
                    this.text?.setText(`Welcome ${inputText.value}!`);
                }
                else {
                    //  Flash the prompt
                    this.tweens.add({
                        targets: this.text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                }
            }

        }, this);

        this.tweens.add({
            targets: element,
            y: this.cameras.main.height / 2,
            duration: 3000,
            ease: 'Power3'
        });

        const backButton = this.add.text(20, 20, 'Back to PlayScene', { color: 'white', fontSize: '20px ' });
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.switch('PlayScene').stop("CreateGame"));

        // Listen to channel creation completion
        window.addEventListener(Messages.CHANNEL_CREATED, this.boundChannelCreatedListenerHandler, {once: true});

    }

    channelCreatedListenerHandler(event: any) {
        // Handle the event here
        let data = event.detail;
        console.log('Channel created with data:', data);
        // this.text?.setText(`\nChannel created with data: ${JSON.stringify(data)}`);
        this.waitingForPlayers?.setVisible(true);
    }

    destroy() {
        window.removeEventListener(Messages.CHANNEL_CREATED, this.boundChannelCreatedListenerHandler);
    }

}
