export class PlayScene extends Phaser.Scene {

    private face?: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "PlayScene" });
    }

    preload ()
    {
        this.load.image('face', 'assets/play_loading_scene.png');

    }

    create (data: { x: number; y: number; })
    {
        const sprite = this.add.sprite(0, 0, 'face');
        const scaleX = this.game.config.width as number / sprite.displayWidth;
        const scaleY = this.game.config.height as number / sprite.displayHeight;
        const scale = Math.min(scaleX, scaleY);
        sprite.setScale(scale);

          // Set the origin of the sprite to the center
  sprite.setOrigin(0.5);

  // Position the sprite in the center of the screen
  const x = this.sys.game.config.width as number / 2;
  const y = this.sys.game.config.height as number / 2;
  sprite.setPosition(x, y);
    }

}