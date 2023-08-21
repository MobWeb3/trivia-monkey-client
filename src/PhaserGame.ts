import Phaser from 'phaser'

import { Bootstrap } from './scenes'
import { PlayScene } from './scenes/playScene'
import { Example } from './scenes/CreateGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
	parent: 'phaser-container',
	backgroundColor: '#282c34',
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
    },
	scene: [Bootstrap, PlayScene, Example],
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config)