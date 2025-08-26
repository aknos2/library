"use strict";

class Book {
    constructor(id, title, author, pages, image, finished = false) {
        this.id = id;
        this.title = title || "Unknown";
        this.author = author || "Unknown";
        this.pages = pages || "Unknown";
        this.finished = finished;
        this.image = image;
        this.dateAdded = new Date().getTime();
    }
}

class Library {
    constructor() {
        this.books = [];
        this.currentBookId = 2;
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(bookId) {
        this.books = this.books.filter(book => book.id !== bookId);
    }

    getBook(bookId) {
        return this.books.find(book => book.id === bookId);
    }

    searchBooks(query) {
        const searchTerm = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    getBooksByStatus(finished = true) {
        return this.books.filter(book => book.finished === finished);
    }

    generateNewBookId() {
        this.currentBookId += 1;
        return `Book${this.currentBookId}`;
    }
}

class UIController {
    constructor(mainElement, formElement, library) {
        this.mainElement = mainElement;
        this.formElement = formElement;
        this.library = library;
    }

    displayBooks(books) {
        this.mainElement.innerHTML = "";
        books.forEach(book => this.mainElement.innerHTML += this.createBookCard(book));
        this.attachEventListeners();
    }

    createBookCard(book) {
        return `
            <div class="cards" id="book-${book.id}">
                <input type="image" src="./icons/edit.svg" data-id="${book.id}" class="edit-button" alt="edit button">
                <div class="img-button">
                    <img src="${book.image}" alt="${book.title}">
                    <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="read-message" style="display: ${book.finished ? 'block' : 'none'};">
                        Finished
                    </div>
                </div>
                <ul class="card-description">
                    <li><b>Title</b>: ${book.title}</li>
                    <li><b>Author</b>: ${book.author}</li>
                    <li><b>Pages</b>: ${book.pages}</li>
                </ul>
            </div>`;
    }

    attachEventListeners() {
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", event => this.editBook(event.target.getAttribute("data-id")));
        });
        document.querySelectorAll(".remove-button").forEach(button => {
            button.addEventListener("click", event => this.removeBook(event.target.getAttribute("data-id")));
        });
    }

    editBook(bookId) {
        const book = this.library.getBook(bookId); // Corrected to use `getBook` method
        if (!book) return;
    
        const card = document.getElementById(`book-${bookId}`);
    
        // Replace the book card content with editable input fields
        card.querySelector('.card-description').innerHTML = `
            <li><b>Title</b>: <input type="text" id="edit-title-${bookId}" value="${book.title}"></li>
            <li><b>Author</b>: <input type="text" id="edit-author-${bookId}" value="${book.author}"></li>
            <li><b>Pages</b>: <input type="number" id="edit-pages-${bookId}" value="${book.pages}"></li>
            <li><b>Finished</b>: <input type="checkbox" id="edit-finished-${bookId}" ${book.finished ? 'checked' : ''}></li>
        `;
    
        // Replace the edit button with a save button
        card.querySelector('.edit-button').outerHTML = `<button class="save-button" data-id="${bookId}">Save</button>`;
    
        // Attach an event listener to the new save button
        document.querySelector(`.save-button[data-id="${bookId}"]`).addEventListener('click', () => this.saveBook(bookId));
    }
    
    saveBook(bookId) {
        const book = this.library.getBook(bookId);
        if (!book) return;
    
        // Retrieve values from the edit fields
        const title = document.getElementById(`edit-title-${bookId}`).value;
        const author = document.getElementById(`edit-author-${bookId}`).value;
        const pages = document.getElementById(`edit-pages-${bookId}`).value;
        const finished = document.getElementById(`edit-finished-${bookId}`).checked;
    
        // Update the book object with new values
        book.title = title;
        book.author = author;
        book.pages = pages;
        book.finished = finished;
    
        // Update the UI by redisplaying the updated list of books
        this.displayBooks(this.library.books);
    }

    removeBook(bookId) {
        this.library.removeBook(bookId);
        this.displayBooks(this.library.books);
    }

    addNewBook(event) {
        event.preventDefault();
        
        const titleInput = document.getElementById("title");
        const authorInput = document.getElementById("author");
        const pagesInput = document.getElementById("pages");
    
        // Check if all fields are valid
        if (!titleInput.checkValidity()) {
            titleInput.reportValidity();
            return;
        }
        if (!authorInput.checkValidity()) {
            authorInput.reportValidity();
            return;
        }
        if (!pagesInput.checkValidity()) {
            pagesInput.reportValidity();
            return;
        }

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        const finished = document.getElementById("finished").checked;
        const image = "/imgs/studio-media-9DaOYUYnOls-unsplash.jpg"; // Default image

        const newBook = new Book(
            this.library.generateNewBookId(),
            title,
            author,
            pages,
            image,
            finished
        );

        this.library.addBook(newBook);
        this.displayBooks(this.library.books);
        this.clearForm();
    }


    clearForm() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("pages").value = "";
        document.getElementById("finished").checked = false;
    }

    filterBooksByStatus(finished) {
        const books = this.library.getBooksByStatus(finished);
        this.displayBooks(books);
    }

    displayRecentlyAddedBooks() {
        // Sort books by dateAdded in descending order (newest first)
        const recentlyAddedBooks = this.library.books.sort((a, b) => b.dateAdded - a.dateAdded);
        
        // Display the sorted list
        this.displayBooks(recentlyAddedBooks);
    }

    searchBooks(query) {
        const books = this.library.searchBooks(query);
        this.displayBooks(books);
    }
}

const library = new Library();
const uiController = new UIController(
    document.querySelector(".main"),
    document.querySelector(".form"),
    library
);

// Load initial books
const initialBooks = [
    new Book("book0", "Da Lat", "Nguyen Vinh", "70", "imgs/lewis-pC_kzUrdxoY-unsplash.jpg", true),
    new Book("book1", "The Psychology of Money", "Morgan Housel", "256", "imgs/morgan-housel-aZ_MmSmAcjg-unsplash.jpg", true),
    new Book("book2", "101 Essays that will change the way you Think", "Brianna West", "448", "imgs/thought-catalog-V5BGaJ0VaLU-unsplash.jpg", false)
];
initialBooks.forEach(book => library.addBook(book));
uiController.displayBooks(library.books);

// Event listeners
document.getElementById("all-books-button").addEventListener("click", () => uiController.displayBooks(library.books));
document.getElementById("finished-books-button").addEventListener("click", () => uiController.filterBooksByStatus(true));
document.getElementById("not-finished-books-button").addEventListener("click", () => uiController.filterBooksByStatus(false));
document.getElementById('recently-added-button').addEventListener('click', () => uiController.displayRecentlyAddedBooks());
document.getElementById("book-search-form").addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("searchbar").value;
    uiController.searchBooks(query);
});
document.querySelector(".form-button").addEventListener("click", event => uiController.addNewBook(event));
document.querySelector("#add-button").addEventListener("click", () => document.getElementById("form").style.display = "block");
document.querySelector(".form-button-cancel").addEventListener("click", () => document.getElementById("form").style.display = "none");


document.getElementById("title").addEventListener("input", event => {
    const input = event.target;

    // Custom validation logic
    if (!input.value) {
        input.setCustomValidity("Custom message: Title is required!"); // Your custom message
    } else {
        input.setCustomValidity(""); // Clear any custom messages when valid
    }

    input.reportValidity(); // Show the current validation message
});

document.getElementById("author").addEventListener("input", event => {
    const input = event.target;

    if (!input.value) {
        input.setCustomValidity("Custom message: Author is required!"); // Your custom message
    } else {
        input.setCustomValidity(""); // Clear custom messages when valid
    }

    input.reportValidity();
});

document.getElementById("pages").addEventListener("input", event => {
    const input = event.target;

    if (input.validity.rangeUnderflow || input.value < 1) {
        input.setCustomValidity("Pages must be at least 1."); // Custom range validation message
    } else if (!input.value) {
        input.setCustomValidity("Custom message: Pages are required!"); // Custom required message
    } else {
        input.setCustomValidity(""); // Clear any custom messages when valid
    }

    input.reportValidity();
});

