const bookDisplay = document.querySelector('#book-display');
const bookElement = document.createElement('div');
const currentLibraryTitle = document.querySelector('.current-library-title');
const librarySelect = document.querySelector('#library-select');

bookElement.classList.toggle('book');
bookElement.innerHTML = 
`<button class="remove-book-button">X</button>
<div class="title-and-author-wrapper">
    <h2 class="book-title"></h2>
    <h3 class="book-author"></h3>
</div>
<div class="pages-and-read-wrapper">
    <p class="book-pages"></p>
    <p class="book-read"></p>
</div>`;

allLibraries = [];
class Library {

    constructor(name) {
        this.name = name;
        this.shelf = [];
        allLibraries.push(this);
    }

    displayBooks() {
        bookDisplay.innerHTML = '';
        bookDisplay.dataset.library = this.name;

        for (let i = 0; i <= (this.shelf.length - 1); i++) {
            const currentBookObject = this.shelf[i];
            const currentBookElement = bookElement.cloneNode(true);
            
            this.writeToBookElement(i, currentBookObject, currentBookElement, this);
            bookDisplay.appendChild(currentBookElement);
        }
    }

    writeToBookElement(index, bookObject, bookElement, library) {
        bookElement.querySelector('.book-title').textContent = `${bookObject.title}`;
        bookElement.querySelector('.book-author').textContent = `${bookObject.author}`;
        bookElement.querySelector('.book-pages').textContent = `${bookObject.pages}`;
        let isBookRead = (bookObject.read)? 'read' : 'not read';
        bookElement.querySelector('.book-read').textContent = isBookRead;
        bookElement.querySelector('.remove-book-button').addEventListener('click', () => {
            bookObject.removeBookFromLibrary(library);
        });   
        bookElement.querySelector('.book-read').addEventListener('click', () => {
            bookObject.changeReadStatus();
        });
        bookElement.dataset.index = index;
    }
}

librarySelect.addEventListener('change', () => {
    let index = librarySelect.selectedIndex;
    let libraryName= librarySelect.options[index].textContent;
    libraryObject = getLibraryObjectByName(libraryName);
    libraryObject.displayBooks();
})

const myLibrary = new Library('My Library');

const myLibraryTwo = new Library('myLibraryTwo');

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}.`;
    }

    checkLibrary() {
        let booksLibrary;
        allLibraries.forEach(library => {
        if (library.shelf.includes(this)) {
            booksLibrary = library;
        }
        });
        return booksLibrary;
    }

    addBookToLibrary(library) {
        library.shelf.push(this);
        library.displayBooks();
    }

    removeBookFromLibrary(library) {
        const libraryIndex = library.shelf.indexOf(this);
        library.shelf.splice(libraryIndex, 1);
        library.displayBooks();
    }

    changeReadStatus() {
        this.read = !this.read;
        let library = this.checkLibrary();
        library.displayBooks();
    }
}

// BOOKS
const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', '295', false);

const theRepublic = new Book('The Republic', 'Plato', '412', true);
 
theHobbit.addBookToLibrary(myLibrary);
theRepublic.addBookToLibrary(myLibrary);


// Interface
const titleInput = document.querySelector('#title-input');
const authorInput = document.querySelector('#author-input');
const pagesInput = document.querySelector('#pages-input');
const readInput = document.querySelector('#read-input');
const libraryInput = document.querySelector('#library-input');
const submit = document.querySelector('#submit');

function clearInterface() {
    titleInput.value = '';
    authorInput.value = '';
    pagesInput.value = '';
    readInput.checked = false;
}

function getLibraryObjectByName(name) {
    let foundLibrary;
    allLibraries.forEach(library => {
        if (library.name == name) foundLibrary = library;
    });
    if (foundLibrary == undefined) clearInterface();
    else return foundLibrary; 
}

submit.addEventListener('click', () =>{
    let title = titleInput.value;
    let author = authorInput.value;
    let pages = pagesInput.value;
    let read = readInput.checked;

    let selectedIndex = libraryInput.selectedIndex;
    let libraryName = libraryInput.options[selectedIndex].textContent;
    let libraryObject = getLibraryObjectByName(libraryName);
    librarySelect.selectedIndex = selectedIndex;

    const book = new Book(title, author, pages, read);
    book.addBookToLibrary(libraryObject);
    
    clearInterface();
});

