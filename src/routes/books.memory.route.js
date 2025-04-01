
const books = [];
let nextId = 0;

async function booksMemoryRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {
    reply.code(200).send(books);
  });

  const getBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.get('/:id', { schema: getBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const booksIds = books.map((book) => book.id);
    if (booksIds.includes(parseInt(id))) {
      const book = books.find((book) => book.id == id);
      reply.code(200).send(book);
    } else {
      reply.code(404).send({ error: 'Book not found' });
    }
  });

  const createBookSchema = {
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.post('/', { schema: createBookSchema }, async (request, reply) => {
    if (request.url === '/booksmemory') {
      const { title, author } = request.body;
      if (title.length === 0) {
        reply.code(400)
        return { error: 'Title is required' };
      }
      books.push({id: nextId, title, author});
      nextId++;
      reply.code(201).send(books[books.length - 1]);
    }
    reply.code(404).send({ error: 'Not implemented' });
  });

  const updateBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.put('/:id', { schema: updateBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const { title, author } = request.body;
    for (let book of books) {
      if (book.id == id) {
        book.title = title;
        book.author = author;
        reply.code(200).send(book);
        return;
      }
    }
    reply.code(404).send({ error: 'Book not found' });
  });

  const deleteBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };
  fastify.delete('/:id', { schema: deleteBookSchema }, async (request, reply) => {
    const { id } = request.params;
    for (let i = 0;i < books.length; i++) {
      if (books[i].id == id) {
        books.splice(i, 1);
        reply.code(204).send();
        return;
      }
    }
    reply.code(404).send({ error: 'Book not found' });
  });
}

export default booksMemoryRoute;