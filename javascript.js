"use strict"

const book1 = document.querySelector("#book1");
const book2 = document.querySelector("#book2");
const book3 = document.querySelector("#book3");
const main = document.querySelector(".main");
const addButton = document.querySelector("#add-button");
const form = document.querySelector(".form");

const library = [book1, book2, book3];

function Book(title, author, pages, finished) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.finished = finished;
}

const newBook = new Book(`${this.title}`, `${this.author}`,`${this.pages}`,`${this.finished}`);

Book.prototype.addBookToLibrary = function() {
    library.push(newBook);
}


const addNewBook = () => {
    main.innerHTML += `<div class="cards">
                <img src="imgs/thought-catalog-V5BGaJ0VaLU-unsplash.jpg" alt="Book3">
                <ul class="card-description">
                    <l1>Title: 101 Essays that will change the way you Think</l1>
                    <l1>Author: Brianna West</l1>
                    <l1>Pages: 448</l1>
                </ul>
            </div>`
}

function openForm() {
    document.getElementById("form").style.display = "block";
}

function closeForm() {
    document.getElementById("form").style.display = "none";
  }