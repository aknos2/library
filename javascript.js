"use strict"

const main = document.querySelector(".main");
const addButton = document.querySelector("#add-button");
const form = document.querySelector(".form");
const formButton = document.querySelector(".form-button");


function Book(id, title, author, pages, image, finished = false) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.finished = finished;
    this.image = image;
}

const library = [];
let currentBook = 2;

const startingBooks = () => {
    const book0 = new Book("book0", "Da Lat", "Nguyen Vinh", "70", "imgs/lewis-pC_kzUrdxoY-unsplash.jpg");
    const book1 = new Book("book1", "The Psychology of Money", "Morgan Housel", "256", "imgs/morgan-housel-aZ_MmSmAcjg-unsplash.jpg");
    const book2 = new Book("book2", "101 Essays that will change the way you Think", "Brianna West", "448", "imgs/thought-catalog-V5BGaJ0VaLU-unsplash.jpg");

    library.push(book0, book1, book2);

    displayLibrary();
}
 

function addBookToLibrary(event) {
    event.preventDefault();
    
    const image = "imgs/studio-media-9DaOYUYnOls-unsplash.jpg";
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;

    currentBook++;
    const newBook = new Book(`Book${currentBook}`, title, author, pages, image);

    library.push(newBook);

    displayLibrary();
}



const displayLibrary = () => {
    main.innerHTML = '';

    // Loop through the library array and create cards for each book
    library.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
            <div class="img-button">
                <img src="${book.image}" alt="${book.title}">
                <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="remove-confirmation-message">
                        <button class="confirm-remove" id="confirm-remove">Delete</button> <br><br><br>
                        <button class="cancel-remove" id="cancel-remove">Cancel</button>
                    </div>
            </div>
            <ul class="card-description">
                <li><b>Title</b>: ${book.title}</li><br>
                <li><b>Author</b>: ${book.author}</li><br>
                <li><b>Pages</b>: ${book.pages}</li>
            </ul>
        </div>`;
    });

    // Attach remove functionality to the newly created remove buttons
    attachRemoveEvent();
}

const attachRemoveEvent = () => {
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener("click", event => {
            const bookId = event.target.getAttribute("data-id");
            const card = document.getElementById(`book-${bookId}`);
            const confirmationMessage = card.querySelector('.remove-confirmation-message');
            
            // Show the confirmation message
            confirmationMessage.style.display = "block"; 
            
            // Handle confirmation
            const removeButtonConfirmation = confirmationMessage.querySelector('.confirm-remove');
            const removeButtonCancel = confirmationMessage.querySelector('.cancel-remove');
            
            removeButtonConfirmation.addEventListener("click", () => {
                removeBook(bookId);
                confirmationMessage.style.display = "none"; // Hide after confirmation
            });
            
            removeButtonCancel.addEventListener("click", () => {
                confirmationMessage.style.display = "none"; // Hide on cancel
            });
        });
    });
};


const removeBook = (bookId) => {
    const bookIndex = library.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        library.splice(bookIndex, 1);
        displayLibrary();
    }
}

startingBooks();
formButton.addEventListener("click", addBookToLibrary);

function openForm() {
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
}
