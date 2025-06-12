/* eslint-disable no-undef */
// handler.test.js
const {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookByIdHandler,
} = require('./handler');

// Mock the nanoid module
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}));

// Mock the books array
jest.mock('./books', () => []);

describe('Book Handler Tests', () => {
  let mockRequest;
  let mockH;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock h response object
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  describe('addBookHandler', () => {
    test('should successfully add a book with valid data', () => {
      mockRequest = {
        payload: {
          name: 'Test Book',
          year: 2023,
          author: 'Test Author',
          summary: 'Test Summary',
          publisher: 'Test Publisher',
          pageCount: 100,
          readPage: 50,
          reading: true,
        },
      };

      const response = addBookHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(201);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: { bookId: 'test-id-123' },
        })
      );
    });

    test('should fail when name is not provided', () => {
      mockRequest = {
        payload: {
          year: 2023,
          author: 'Test Author',
          pageCount: 100,
          readPage: 50,
        },
      };

      const response = addBookHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(400);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
      );
    });

    test('should fail when readPage is greater than pageCount', () => {
      mockRequest = {
        payload: {
          name: 'Test Book',
          pageCount: 100,
          readPage: 150,
        },
      };

      const response = addBookHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(400);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
      );
    });
  });

  describe('getBooksHandler', () => {
    test('should return all books', () => {
      mockRequest = {
        query: {},
      };

      const response = getBooksHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(200);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.any(Object),
        })
      );
    });

    test('should filter books by name', () => {
      mockRequest = {
        query: {
          name: 'test',
        },
      };

      const response = getBooksHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(200);
    });
  });

  describe('getBookByIdHandler', () => {
    test('should return 404 when book is not found', () => {
      mockRequest = {
        params: {
          id: 'non-existent-id',
        },
      };

      const response = getBookByIdHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(404);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
      );
    });
  });

  describe('editBookHandler', () => {
    test('should fail when name is not provided', () => {
      mockRequest = {
        params: { id: 'test-id' },
        payload: {
          year: 2023,
          pageCount: 100,
          readPage: 50,
        },
      };

      const response = editBookHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(400);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
      );
    });
  });

  describe('deleteBookByIdHandler', () => {
    test('should return 404 when book is not found', () => {
      mockRequest = {
        params: {
          id: 'non-existent-id',
        },
      };

      const response = deleteBookByIdHandler(mockRequest, mockH);

      expect(response.code).toHaveBeenCalledWith(404);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
      );
    });
  });
});
