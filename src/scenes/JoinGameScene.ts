import { sendMessage } from "../utils/MessageListener";
import { Messages } from "../utils/Messages";

export class JoinGame extends Phaser.Scene {
    text?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "JoinGame" });
    }

    preload() {
        this.load.html('channelform', 'assets/channelform.html');
        this.text = this.add.text(this.cameras.main.width / 4, 10, 'Please enter the channel name', {
            color: 'white',
            fontSize: '20px',
            wordWrap: { width: this.cameras.main.width, useAdvancedWrap: true }
        });
    }

    create() {
        this.text?.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 4);
        this.text?.setOrigin(0.5);

        const element = this.add.dom(this.cameras.main.width / 2, 0).createFromCache('channelform');

        element.addListener('click');

        element.on('click', (event: any) => {
            if (event.target.name === 'playButton') {
                const channelTextInput = element.getChildByName('channelField') as HTMLInputElement;
                const nameTextInput = element.getChildByName('nameField') as HTMLInputElement;

                if (channelTextInput?.value !== '' && nameTextInput?.value !== '') {
                    element.removeListener('click');
                    element.setVisible(false);

                    this.text?.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
                    this.text?.setOrigin(0.5);
                    sendMessage(Messages.ENTER_CHANNEL, 
                        {"channelId": channelTextInput.value,
                         "nickname": nameTextInput.value});

                    this.text?.setText(`Joining channel ${channelTextInput.value}...`);
                }
                else {
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
        backButton.on('pointerdown', () => this.scene.switch('PlayScene').stop("JoinGame"));

        window.addEventListener(Messages.CHANNEL_JOINED, this.channelJoinedListenerHandler.bind(this), { once: true });
    }

    channelJoinedListenerHandler(event: any) {
        let data = event.detail;
        console.log('Channel joined with data:', data);
        this.text?.appendText(`\nChannel joined with data: ${JSON.stringify(data)}`);
    }

    destroy() {
        window.removeEventListener(Messages.CHANNEL_JOINED, this.channelJoinedListenerHandler.bind(this));
    }
}