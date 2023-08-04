import Phaser from 'phaser'
import { sendMessage, addMessageListener } from '../utils/MessageListener'


export class Bootstrap extends Phaser.Scene
{
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image   
    
    constructor()
    {
        super('main-menu')
    }
    
    init()
    {
        
        this.cursors = this.input?.keyboard?.createCursorKeys()
    }
    
    preload()
    {
        this.load.image('glass-panel', 'assets/glassPanel.png')
        this.load.image('cursor-hand', 'assets/cursor_hand.png')
    }
    
    create()
    {
        const { width, height } = this.scale
        
        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.6, 'glass-panel')
        .setDisplaySize(150, 50)
        
        this.add.text(playButton.x, playButton.y, 'Play')
        .setOrigin(0.5)
        
        // Settings button
        const settingsButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'glass-panel')
        .setDisplaySize(150, 50)
        
        this.add.text(settingsButton.x, settingsButton.y, 'Settings')
        .setOrigin(0.5)
        
        // Credits button
        const connectNow = this.add.image(settingsButton.x, settingsButton.y + settingsButton.displayHeight + 10, 'glass-panel')
        .setDisplaySize(150, 50)
        
        this.add.text(connectNow.x, connectNow.y, 'Connect Now')
        .setOrigin(0.5)

        // Disconnect button
        const disconnect = this.add.image(connectNow.x, connectNow.y + connectNow.displayHeight + 10, 'glass-panel')
        .setDisplaySize(150, 50)
        
        this.add.text(disconnect.x, disconnect.y, 'Disconnect')
        .setOrigin(0.5)
        
        this.buttons.push(playButton)
        this.buttons.push(settingsButton)
        this.buttons.push(connectNow)
        this.buttons.push(disconnect)
        
        this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
        this.selectButton(0)
        
        playButton.on('selected', () => {
            console.log('play')
        })
        
        settingsButton.on('selected', () => {
            console.log('settings')
        })

        const persistedData = localStorage.getItem('TryConnection');

        if (persistedData) {
            const data = JSON.parse(persistedData);
            // Handle the persisted data from localStorage
            console.log('Persisted data:', data);
            // Perform actions based on the persisted data
          }

        
        connectNow.on('selected', () => {
            console.log('Connect Now')
            sendMessage('TryConnection', true);
        })

        disconnect.on('selected', () => {
            console.log('Disconnect Now')
            sendMessage('Disconnect', true);
        })
        
        // add click event listener to each button
        this.buttons.forEach((button, index) => {
            button.setInteractive()
            button.on('pointerdown', () => {
                this.selectButton(index)
                this.confirmSelection()
            })
        })

        addMessageListener('Connected', (data) => {
            // Handle the received data from React
            console.log('Received data from React -> Phaser:', data);
            // Perform actions based on the received data
        });
    }
    
    selectButton(index: number)
    {
        const currentButton = this.buttons[this.selectedButtonIndex]
        
        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)
        
        const button = this.buttons[index]
        
        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)
        
        // move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5
        this.buttonSelector.y = button.y + 10
        
        // store the new selected index
        this.selectedButtonIndex = index   
    }
    
    selectNextButton(change = 1)
    {
        let index = this.selectedButtonIndex + change
        
        // wrap the index to the front or end of array
        if (index >= this.buttons.length)
        {
            index = 0
        }
        else if (index < 0)
        {
            index = this.buttons.length - 1
        }
        
        this.selectButton(index)
    }
    
    confirmSelection()
    {
        // get the currently selected button
        const button = this.buttons[this.selectedButtonIndex]
        
        // emit the 'selected' event
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