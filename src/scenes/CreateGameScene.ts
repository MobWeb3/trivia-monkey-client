export class Example extends Phaser.Scene
{

    constructor() {
        super({ key: "CreateGame" });
    }

    preload ()
    {
        this.load.html('nameform', 'assets/nameform.html');
        this.load.atlas('cards', 'assets/cards.png', 'assets/cards.json');
    }

    create ()
    {
        //  Create a stack of random cards

        const frames = this.textures.get('cards').getFrameNames();

        let x = 100;
        let y = 100;

        for (let i = 0; i < 64; i++)
        {
            const image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive({ draggable: true });

            x += 4;
            y += 4;
        }

        this.input.on('dragstart',  (pointer:any, gameObject:any) =>
        {

            this.children.bringToTop(gameObject);

        }, this);

        this.input.on('drag', (pointer: any, gameObject: { x: any; y: any; }, dragX: any, dragY: any) =>
        {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        const text = this.add.text(300, 10, 'Please enter your name', { color: 'white', fontSize: '20px '});

        const element = this.add.dom(400, 0).createFromCache('nameform');

        element.addListener('click');

        element.on('click',  (event:any) =>
        {
            if (event.target.name === 'playButton')
            {
                const domElement = this as unknown as Phaser.GameObjects.DOMElement;
                // const inputText = domElement.getChildByName('nameField');
                const inputText = domElement.getChildByName('nameField') as HTMLInputElement;


                //  Have they entered anything?
                if (inputText?.value !== '')
                {
                    //  Turn off the click events
                    domElement.removeListener('click');

                    //  Hide the login element
                    domElement.setVisible(false);

                    //  Populate the text with whatever they typed in
                    text.setText(`Welcome ${inputText.value}`);
                }
                else
                {
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

        });
     
        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });

    }
}

// const config = {
//     type: Phaser.AUTO,
//     parent: 'phaser-example',
//     width: 800,
//     height: 600,
//     backgroundColor: '#222288',
//     dom: {
//         createContainer: true
//     },
//     scene: Example
// };

// const game = new Phaser.Game(config);