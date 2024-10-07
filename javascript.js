"use strict"

const main = document.querySelector(".main");
const addButton = document.querySelector("#add-button");
const form = document.querySelector(".form");
const formButton = document.querySelector(".form-button");
const allBooksButton = document.querySelector("#all-books-button");
const recentlyAddedButton = document.querySelector("#recently-added-button");
const finishedBooksButton = document.querySelector("#finished-books-button");
const notFinishedBooksButton = document.querySelector("#not-finished-books-button");

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
    const book0 = new Book("book0", "Da Lat", "Nguyen Vinh", "70", "imgs/lewis-pC_kzUrdxoY-unsplash.jpg", true);
    const book1 = new Book("book1", "The Psychology of Money", "Morgan Housel", "256", "imgs/morgan-housel-aZ_MmSmAcjg-unsplash.jpg", true);
    const book2 = new Book("book2", "101 Essays that will change the way you Think", "Brianna West", "448", "imgs/thought-catalog-V5BGaJ0VaLU-unsplash.jpg", false);

    library.push(book0, book1, book2);

    displayLibrary();
}
 

function addBookToLibrary(event) {
    event.preventDefault();
    
    const image = "imgs/studio-media-9DaOYUYnOls-unsplash.jpg";
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let pages = document.getElementById('pages').value;
    const finished = document.getElementById("finished").checked;

    if (title === "") {
        title = "Unknown";
    } 
    if (author === "") {
        author = "Unknown";
    }
    if (pages === "") {
        pages = "Unknown";
    }

    currentBook++;
    const newBook = new Book(`Book${currentBook}`, title, author, pages, image, finished);

    if (finished) {
        document.querySelector(".read-message").style.display = "block";
    } else if (finished === false) {
        document.querySelector(".read-message").style.display = "none";
    }

    library.push(newBook);

    displayLibrary();
}

const displayLibrary = () => {
    main.innerHTML = '';

    // Loop through the library array and create cards for each book
    library.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
            <input type="image" src="./icons/edit.svg"  data-id="${book.id}" class="edit-button" id="edit-button" alt="edit button">
            <div class="img-button">
                <img src="${book.image}" alt="${book.title}">
                <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="read-message" style="display: ${book.finished ? 'block' : 'none'};">
                        Finished
                    </div>
                    <div class="remove-confirmation-message">
                        <button class="confirm-remove" id="confirm-remove">Delete</button> <br><br><br>
                        <button class="cancel-remove" id="cancel-remove">Cancel</button>
                    </div>
            </div>
            <ul class="card-description">
                <li><b>Title</b>: ${book.title}</li>
                <li><b>Author</b>: ${book.author}</li>
                <li><b>Pages</b>: ${book.pages}</li>
            </ul>
        </div>`;
    });

    // Attach remove functionality to the newly created remove buttons
    attachRemoveEvent();
    attachEditEvent();
}


// Edit book function

const attachEditEvent = () => {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', event => {
            const bookId = event.target.getAttribute('data-id');
            const card = document.getElementById(`book-${bookId}`);
            
            const titleElement = card.querySelector('.card-description li:nth-child(1)');
            const authorElement = card.querySelector('.card-description li:nth-child(2)');
            const pagesElement = card.querySelector('.card-description li:nth-child(3)');

             // Add finished status editing element
            let finishedElement = card.querySelector('.card-description .finished-status');
            if (!finishedElement) {
                finishedElement = document.createElement('li');
                finishedElement.classList.add('finished-status');
                card.querySelector('.card-description').appendChild(finishedElement);
            }
            
            // Turn text into input fields
            titleElement.innerHTML = `<b>Title</b>: <input type="text" id="edit-title-${bookId}" value="${library.find(book => book.id === bookId).title}">`;
            authorElement.innerHTML = `<b>Author</b>: <input type="text" id="edit-author-${bookId}" value="${library.find(book => book.id === bookId).author}">`;
            pagesElement.innerHTML = `<b>Pages</b>: <input type="number" id="edit-pages-${bookId}" value="${library.find(book => book.id === bookId).pages}">`;
            
             // Add the finished checkbox
             pagesElement.insertAdjacentHTML('afterend', `
                <div class="finished-section">
                    <label id="finished-label-${bookId}" class="finished-label" for="finished-${bookId}">
                        <b>Finished reading?</b>
                    </label>
                    <input type="checkbox" id="finished-${bookId}" class="finished-checkbox" ${library.find(book => book.id === bookId).finished ? 'checked' : ''}>
                </div>
            `);
            // Replace the Edit button with a Save button
            button.outerHTML = `<button class="save-button" data-id="${bookId}">Save</button>`;

            // Attach save event to the button
            attachSaveEvent(bookId, titleElement, authorElement, pagesElement, finishedElement);
        });
    });
}

const attachSaveEvent = (bookId, titleElement, authorElement, pagesElement, finishedElement) => {
    document.querySelector(`.save-button[data-id="${bookId}"]`).addEventListener('click', () => {
        const title = document.getElementById(`edit-title-${bookId}`).value;
        const author = document.getElementById(`edit-author-${bookId}`).value;
        const pages = document.getElementById(`edit-pages-${bookId}`).value;
        const finished = document.getElementById(`finished-${bookId}`).checked;

        // Find the book in the library and update its properties
        const book = library.find(book => book.id === bookId);
        book.title = title;
        book.author = author;
        book.pages = pages;
        book.finished = finished;

        // Update the display to show the new details
        titleElement.innerHTML = `<b>Title</b>: ${title}`;
        authorElement.innerHTML = `<b>Author</b>: ${author}`;
        pagesElement.innerHTML = `<b>Pages</b>: ${pages}`;
         // Update the finished status display (read-message)
         const readMessage = document.querySelector(`#book-${bookId} .read-message`);
         readMessage.style.display = book.finished ? 'block' : 'none';
         // Hide the finished checkbox
        const finishedLabel = document.getElementById(`finished-label-${bookId}`);
        const finishedCheckbox = document.getElementById(`finished-${bookId}`);
        finishedLabel.style.display = 'none';
        finishedCheckbox.style.display = 'none';

        // Replace the Save button back to Edit button
        const saveButton = document.querySelector(`.save-button[data-id="${bookId}"]`);
        saveButton.outerHTML = `<input type="image" src="./icons/edit.svg" data-id="${bookId}" class="edit-button" alt="edit button">`;

        // Reattach the edit event handler
        attachEditEvent();

    });
}


// Remove book function

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


// Search book function

document.getElementById("book-search-form").addEventListener("submit", event => {
    event.preventDefault();

    const searchQuery = document.getElementById("searchbar").value.toLowerCase();
    
    const filteredBooks = library.filter(book => 
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery)
    );

    console.log('Filtered Books:', filteredBooks);
    
    displayFilteredBooks(filteredBooks);
});

const displayFilteredBooks = (filteredBooks) => {
    main.innerHTML = "";

    if(filteredBooks.length === 0) {
        main.innerHTML = `<p>No Books Found</p>`;
        return;
    }

    filteredBooks.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
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
    });

    attachRemoveEvent();
    attachEditEvent();
}


const allBooks = () => {
    main.innerHTML = "";
    displayLibrary();
}

const recentlyAdded = () => {
    main.innerHTML = "";
    const reversedLibrary = [...library].reverse();

    reversedLibrary.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
            <input type="image" src="./icons/edit.svg"  data-id="${book.id}" class="edit-button" id="edit-button" alt="edit button">
            <div class="img-button">
                <img src="${book.image}" alt="${book.title}">
                <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="read-message" style="display: ${book.finished ? 'block' : 'none'};">
                        Finished
                    </div>
                    <div class="remove-confirmation-message">
                        <button class="confirm-remove" id="confirm-remove">Delete</button> <br><br><br>
                        <button class="cancel-remove" id="cancel-remove">Cancel</button>
                    </div>
            </div>
            <ul class="card-description">
                <li><b>Title</b>: ${book.title}</li>
                <li><b>Author</b>: ${book.author}</li>
                <li><b>Pages</b>: ${book.pages}</li>
            </ul>
        </div>`;
    });

    // Attach remove functionality to the newly created remove buttons
    attachRemoveEvent();
    attachEditEvent();
}

const finishedBooks = () => {
    main.innerHTML = "";
    const onlyFinishedBooks = library.filter(book => book.finished);

    onlyFinishedBooks.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
            <input type="image" src="./icons/edit.svg"  data-id="${book.id}" class="edit-button" id="edit-button" alt="edit button">
            <div class="img-button">
                <img src="${book.image}" alt="${book.title}">
                <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="read-message" style="display: ${book.finished ? 'block' : 'none'};">
                        Finished
                    </div>
                    <div class="remove-confirmation-message">
                        <button class="confirm-remove" id="confirm-remove">Delete</button> <br><br><br>
                        <button class="cancel-remove" id="cancel-remove">Cancel</button>
                    </div>
            </div>
            <ul class="card-description">
                <li><b>Title</b>: ${book.title}</li>
                <li><b>Author</b>: ${book.author}</li>
                <li><b>Pages</b>: ${book.pages}</li>
            </ul>
        </div>`;
    });

    // Attach remove functionality to the newly created remove buttons
    attachRemoveEvent();
    attachEditEvent();
}

const notFinishedBooks = () => {
    main.innerHTML ="";
    const onlyNotFinishedBooks = library.filter(book => book.finished === false);

    onlyNotFinishedBooks.forEach(book => {
        main.innerHTML += `
        <div class="cards" id="book-${book.id}">
            <input type="image" src="./icons/edit.svg"  data-id="${book.id}" class="edit-button" id="edit-button" alt="edit button">
            <div class="img-button">
                <img src="${book.image}" alt="${book.title}">
                <button class="remove-button" data-id="${book.id}">X</button>
                    <div class="read-message" style="display: ${book.finished ? 'block' : 'none'};">
                        Finished
                    </div>
                    <div class="remove-confirmation-message">
                        <button class="confirm-remove" id="confirm-remove">Delete</button> <br><br><br>
                        <button class="cancel-remove" id="cancel-remove">Cancel</button>
                    </div>
            </div>
            <ul class="card-description">
                <li><b>Title</b>: ${book.title}</li>
                <li><b>Author</b>: ${book.author}</li>
                <li><b>Pages</b>: ${book.pages}</li>
            </ul>
        </div>`;
    });

    // Attach remove functionality to the newly created remove buttons
    attachRemoveEvent();
    attachEditEvent();
}

function openForm() {
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
}

startingBooks();
formButton.addEventListener("click", addBookToLibrary);
allBooksButton.addEventListener("click", allBooks);
recentlyAddedButton.addEventListener("click", recentlyAdded);
finishedBooksButton.addEventListener("click", finishedBooks);
notFinishedBooksButton.addEventListener("click", notFinishedBooks);