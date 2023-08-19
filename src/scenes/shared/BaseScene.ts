import Phaser from 'phaser'

export class BaseScene extends Phaser.Scene {
  protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  protected buttons: Phaser.GameObjects.Image[] = []
  protected selectedButtonIndex = 0
  protected buttonSelector!: Phaser.GameObjects.Image


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
  createButtons(width: number, height: number) {}

  createButtonSelector() {
    this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
    this.selectButton(0)
  }

  addEventListeners(){};

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

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.up!)
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.down!)
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors?.space!)

    if (upJustPressed) {
      this.selectNextButton(-1)
    }
    else if (downJustPressed) {
      this.selectNextButton(1)
    }
    else if (spaceJustPressed) {
      this.confirmSelection()
    }
  }
}