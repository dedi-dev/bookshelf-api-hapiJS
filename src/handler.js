const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.header('Access-Control-Allow-Origin', '*');
  response.code(500);
  return response;
};

const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  console.log(request.query);
  let booksFilter = books;

  if (name) {
    booksFilter = booksFilter.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  switch (reading) {
  case '0':
    booksFilter = booksFilter.filter((book) => book.reading === false);
    break;
  case '1':
    booksFilter = booksFilter.filter((book) => book.reading === true);
    break;
  default:
    break;
  }
  switch (finished) {
  case '0':
    booksFilter = booksFilter.filter((book) => book.finished === false);
    break;
  case '1':
    booksFilter = booksFilter.filter((book) => book.finished === true);
    break;
  default:
    break;
  }

  console.log(booksFilter);

  const booksResponse = booksFilter.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  const response = h.response({
    status: 'success',
    data: {
      books: booksResponse,
    },
  });
  response.header('Access-Control-Allow-Origin', '*');
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book: book,
      },
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.header('Access-Control-Allow-Origin', '*');
  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(400);
    return response;
  }

  const book = books.filter((n) => n.id === id)[0];

  if (book) {
    const updatedAt = new Date().toISOString();
    const updatedBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage,
      reading,
      insertedAt: book.insertedAt,
      updatedAt,
    };
    const indexBook = books.findIndex((book) => book.id === id);
    books[indexBook] = updatedBook;
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.header('Access-Control-Allow-Origin', '*');
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book) {
    const indexBook = books.findIndex((book) => book.id === id);
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.header('Access-Control-Allow-Origin', '*');
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookByIdHandler,
};
