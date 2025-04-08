import { request } from "http";

async function userRoute(fastify, options) {

    // register
    const registerSchema = {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
    }
    fastify.post('/register', {schema : registerSchema} ,async (request, reply) => {
        const {username, password} = request.body;
        if (username == ""){
            reply.code(400).send({ error: 'Username is required' });
            return;
        }
        if (password == ""){
            reply.code(400).send({ error: 'Password is required' });
            return;
        }
        const user = await fastify.prisma.user.create({
            data:{
                username : username,
                password : password
            }
        })
        reply.code(201).send(user);
    })

    // login
    const loginSchema = {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
    }
    fastify.post('/login', {schema : loginSchema} ,async (request, reply) => {
        const {username, password} = request.body;
        const user = await fastify.prisma.user.findUnique({
            where: {username : username}
        })
        if (user == null){
            reply.code(400).send({ error: 'Username not registered. Please register yourself first' });
            return;
        }
        if (user.password != password){
            reply.code(400).send({ error: 'Incorrect password' });
            return;
        }
        request.session.userId = user.id;
        reply.code(200).send({message : 'Login successful', userId : request.session.userId});
    })

    // get user
    fastify.get('/me', async (request, reply) => {
        const user = await fastify.prisma.user.findUnique({
            where: {id : parseInt(request.session.userId)}
        })
        if (user == null){
            reply.code(400).send({ error: 'User not found' });
            return;
        }
        reply.code(200).send(user);
    })

}

export default userRoute;