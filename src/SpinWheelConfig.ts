import Phaser from 'phaser'

import { SpinWheelScene } from './scenes/SpinWheelScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
	parent: 'phaser-container',
	backgroundColor: '#139485',
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	dom: {
        createContainer: true
    }
}

class GameInstance {
	private static instance: Phaser.Game | null = null;

	private constructor() {}

	public static getInstance(): Phaser.Game {
		if (!GameInstance.instance) {
			GameInstance.instance = new Phaser.Game(config);
		}
		return GameInstance.instance;
	}

	public static startScene(sceneKey: string, data?: any) {
		if (GameInstance.instance) {
			GameInstance.instance?.scene.add(sceneKey, SpinWheelScene, true, data);
		}
		 else {
			const instance = GameInstance.getInstance();
			if (instance  && instance.scene.keys[sceneKey] === null) {
				instance.scene.add(sceneKey, SpinWheelScene, true, data);
			}
		}
		return GameInstance.instance;
	}
}

export default GameInstance;