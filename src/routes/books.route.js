let nextId = 0;
async function booksRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {
    const books = await fastify.prisma.book.findMany();
    return books;
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
    const book = await fastify.prisma.book.findUnique({
      where: { id },
    });
    if (book == null) {
      reply.code(404).send({ error: 'Book not found' });
    } else {
      reply.code(200).send(book);
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
    const { title, author } = request.body;
    if (title == ""){
      reply.code(400).send({ error: 'Title is required' });
      return;
    }
    const book = await fastify.prisma.book.create({
      data: {
        id:nextId,
        title,
        author,
      },
    });
    nextId++;
    reply.code(201).send(book);
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
    try {
      const book = await fastify.prisma.book.update({
        where: { id:parseInt(id) },
        data: {
          title,
          author,
        },
      });
      reply.code(200).send(book);
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'Book not found' });
      }
    }
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
    try {
      const book = await fastify.prisma.book.delete({
        where: { id:parseInt(id) },
      });
      reply.code(204).send(book);
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'Book not found' });
      }
    }
  });
}

export default booksRoute;