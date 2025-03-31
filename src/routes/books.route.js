async function booksRoute(fastify, options) {
    fastify.get('/', async (request, reply) => {
      const books = await fastify.prisma.book.findMany();
      return books;
    });
  
    fastify.get('/:id', async (request, reply) => {
      const book = await fastify.prisma.book.findUnique({
        where: { id: parseInt(request.params.id) },
      });
      if (!book) {
        reply.code(404).send({ error: 'Book not found' });
      }
      return book;
    });
  
    fastify.post('/', async (request, reply) => {
      const { title, author } = request.body;
      if (!title || !author) {
        reply.code(400).send({ error: 'Title and author are required' });
        return;
      }
      const book = await fastify.prisma.book.create({
        data: { title, author },
      });
      reply.code(201).send(book);
    });
  
    fastify.put('/:id', async (request, reply) => {
      const { title, author } = request.body;
      try {
        const book = await fastify.prisma.book.update({
          where: { id: parseInt(request.params.id) },
          data: { title, author },
        });
        return book;
      } catch {
        reply.code(404).send({ error: 'Book not found' });
      }
    });
  
    fastify.delete('/:id', async (request, reply) => {
      try {
        await fastify.prisma.book.delete({
          where: { id: parseInt(request.params.id) },
        });
        reply.code(204).send();
      } catch {
        reply.code(404).send({ error: 'Book not found' });
      }
    });
  }

  export default booksRoute;