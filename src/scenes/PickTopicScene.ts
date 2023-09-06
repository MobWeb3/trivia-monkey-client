export class PickTopicScene extends Phaser.Scene {
    private searchBar?: Phaser.GameObjects.DOMElement;
    private searchResults?: Phaser.GameObjects.DOMElement;

    constructor() {
        super({ key: 'PickTopicScene' });
    }

    create() {
        this.createSearchBar();
    }

    private createSearchBar() {
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
        this.searchBar = this.add.dom(x, y, 'input', 'background-color: lime; width: 220px; height: 30px; font: 15px Arial; border-radius: 5px; border: none; padding: 5px;');
        this.searchBar.addListener('keyup').on('keyup', this.handleSearch);
    }

    private handleSearch = (event: any) => {
        if (event.keyCode === 13) { // Enter key
            const searchQuery = (this.searchBar?.node as HTMLInputElement).value;
            this.displaySearchResults(searchQuery);
        }
    }

    private displaySearchResults(query: string) {
        // Here you should implement the logic to fetch and display the search results based on the query.
        // For now, let's just display the query in a dropdown-like element.
        if (this.searchResults) {
            this.searchResults.destroy();
        }
        const x = this.searchBar?.x as number;
        const y = (this.searchBar?.y as number) + 80; // 30 is the height of the searchBar
    
        // Create a div for each result item
        const resultItem = this.add.dom(x, y, 'div', 'background-color: white; width: 220px; height: 100px; font: 15px Arial; color: #000; border-radius: 5px; border: 1px solid #ccc; padding: 10px;', query);
    
        // Add a click event listener to the result item
        resultItem.addListener('click').on('click', () => {
            this.handleResultSelection(query);
        });
    
        // Add the result item to the search results
        this.searchResults = resultItem;
    }
    
    private handleResultSelection(selectedItem: string) {
        // Here you should implement the logic to handle the selection of a result item.
        // For now, let's just log the selected item.
        console.log('Selected item:', selectedItem);
    }
}