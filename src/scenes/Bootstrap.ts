import Phaser from 'phaser'
import { sendMessage } from '../utils/MessageListener'
import { Messages } from '../utils/Messages'
import { PlayScene } from './playScene'


export class Bootstrap extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image  
  
    private readonly BUTTON_WIDTH = 150
    private readonly BUTTON_HEIGHT = 50
  
    constructor() {
      super('Bootstrap')
    }
  
    init() {
      const cursors = this.input?.keyboard?.createCursorKeys();
      this.cursors = cursors
    }
  
    preload() {
      this.load.image('glass-panel', 'assets/glassPanel.png')
      this.load.image('cursor-hand', 'assets/cursor_hand.png')
    }
  
    create() {
      const { width, height } = this.scale
  
      this.createButtons(width, height)
      this.createButtonSelector()
      this.addEventListeners()
    }
    createButtons(width: number, height: number) {
        const buttonData = [
          { text: 'Play', yOffset: 0 },
          { text: 'Settings', yOffset: this.BUTTON_HEIGHT + 10 },
          { text: 'Connect Now', yOffset: (this.BUTTON_HEIGHT + 10) * 2 },
          { text: 'Disconnect', yOffset: (this.BUTTON_HEIGHT + 10) * 3 },
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
  
    createButtonSelector() {
      this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
      this.selectButton(0)
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
        console.log('play')
        // this.game.scene.start('PlayScene', PlayScene);
        this.scene.stop('Bootstrap').launch('PlayScene', { x: 0, y: 0 });
      })
  
      this.buttons[1].on('selected', () => {
        console.log('settings')
      })
  
      this.buttons[2].on('selected', () => {
        console.log('Connect Now')
        sendMessage(Messages.TRY_CONNECTION, true)
      })
  
      this.buttons[3].on('selected', () => {
        console.log('Disconnect Now')
        sendMessage(Messages.TRY_DISCONNECT, true)
      })
    }
  
    selectButton(index: number) {
      const currentButton = this.buttons[this.selectedButtonIndex]
      const button = this.buttons[index]
  
      currentButton.setTint(0xffffff)
      button.setTint(0x66ff7f)
  
      this.buttonSelector.x = button.x + button.displayWidth * 0.5
      this.buttonSelector.y = button.y + 10
  
      this.selectedButtonIndex = index   
    }
  
    selectNextButton(change = 1) {
      let index = this.selectedButtonIndex + change
  
      if (index >= this.buttons.length) {
        index = 0
      } else if (index < 0) {
        index = this.buttons.length - 1
      }
  
      this.selectButton(index)
    }
  
    confirmSelection() {
      const button = this.buttons[this.selectedButtonIndex]
      button.emit('selected')
    }
      
    update()
    {
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.up!)
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.down!)
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.space!)
        
        if (upJustPressed)
        {
            this.selectNextButton(-1)
        }
        else if (downJustPressed)
        {
            this.selectNextButton(1)
        }
        else if (spaceJustPressed)
        {
            this.confirmSelection()
        }
    }
}