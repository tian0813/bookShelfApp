const books = [];
const STORAGE_KEY = "BOOKSHELF_APPS";
let editingBookId = null;

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId !== null) {
    const bookIndex = books.findIndex((b) => b.id === editingBookId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        id: editingBookId,
        title,
        author,
        year,
        isComplete,
      };
      alert("Buku berhasil diperbarui");
    }
    editingBookId = null;
  } else {
    const bookObject = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(bookObject);
    alert("Buku baru berhasil ditambahkan");
  }
  saveData();
  renderBooks();
  resetForm();
}

function resetForm() {
  document.getElementById("bookForm").reset();
}

function renderBooks(filteredBooks = books) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function createBookElement(book) {
  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-item");
  bookContainer.setAttribute("data-bookid", book.id);

  bookContainer.innerHTML = `
    <h3>${book.title}</h3>
    <p>Penulis: ${book.author}</p>
    <p>Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id})">${book.isComplete ? "Belum selesai" : "Selesai"} dibaca</button>
      <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
      <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit</button>
    </div>
  `;

  return bookContainer;
}

function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
    if (confirmation) {
      books.splice(bookIndex, 1);
      saveData();
      renderBooks();
      alert("Buku berhasil dihapus");
    }
  }
}

function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    editingBookId = bookId;
    
    document.getElementById("bookFormTitle").focus();
  }
}

function searchBook() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  renderBooks(filteredBooks);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books.push(...JSON.parse(storedBooks));
    renderBooks();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  loadBooksFromStorage();
});
