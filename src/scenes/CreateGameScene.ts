export class Example extends Phaser.Scene {

    constructor() {
        super({ key: "CreateGame" });
    }

    preload() {
        this.load.html('nameform', 'assets/nameform.html');
        
    }

    create() {
        const text = this.add.text(this.cameras.main.width / 4, 10, 'Please enter your name', { color: 'white', fontSize: '20px ' });
        text.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 4);
        text.setOrigin(0.5);

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

                    text.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
                    text.setOrigin(0.5);
                    
                    //  Populate the text with whatever they typed in
                    text.setText(`Welcome ${inputText.value}!`);
                }
                else {
                    //  Flash the prompt
                    this.tweens.add({
                        targets: text,
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

    }
}
