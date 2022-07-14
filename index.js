const express = require('express');
const { engine } = require('express-handlebars');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PrismaClient, prisma } = require("@prisma/client");

require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const client = new PrismaClient();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

io.on('connection', async (socket) => {
    console.log('a user connected: ', socket.id);
    socket.emit('dev', 'Welcome to the chat');

    const boards = await client.board.findMany({
        include: {
            cards: true
        }
    });
    socket.emit('boards', boards)
    console.log('sent', 'boards', 'to', socket.id);

    socket.on('new-board', async (data) => {
        console.log('new board: ', data);
        
        const board = await client.board.create({
            data: {
                name: data.name,
                description: data.description
            }
        });

        const boards = await client.board.findMany({
            include: {
                cards: true
            }
        });

        io.emit('boards', boards);
        console.log('boards refreshed...');
    });

    socket.on('add-card', async (data) => {
        console.log('new card: ', data);
        const card = await client.card.create({
            data: {
                name: data.name,
                status: data.status,
                boardId: data.boardId
            }
        });

        const boards = await client.board.findMany({
            include: {
                cards: true
            }
        });

        io.emit('boards', boards);
        console.log('boards refreshed...');
    });

    socket.on('edit-card', async (data) => {
        console.log('card edit: ', data);
        const card = await client.card.update({
            where: {
                id: data.cardId
            },
            data: {
                status: data.status
            }
        });

        const boards = await client.board.findMany({
            include: {
                cards: true
            }
        });

        io.emit('boards', boards);
        console.log('boards refreshed...');
    });

    socket.on('delete-card', async (data) => { 
        console.log('card delete: ', data);
        const card = await client.card.delete({
            where: {
                id: data.cardId
            }
        });

        const boards = await client.board.findMany({
            include: {
                cards: true
            }
        });

        io.emit('boards', boards);
        console.log('boards refreshed...');
    });

    socket.on('delete-board', async (data) => {
        console.log('board delete: ', data);
        const board = await client.board.delete({
            where: {
                id: data.boardId
            }
        });

        const boards = await client.board.findMany({
            include: {
                cards: true
            }
        });

        io.emit('boards', boards);
        console.log('boards refreshed...');
    });
});

io.on('message', (socket) => {
    console.log('message: ', socket.id);
});

io.on('disconnect', () => {
    console.log('user disconnected');
});

io.on('new-board', (socket) => {
    console.log('new board: ', socket.id);
    console.table(socket.data);
});

app.get('/', (req, res) => {
    return res.render('home');
});

const port = process.env.port;
httpServer.listen(port, () => {
    console.log(`express app listening on port ${port}...`);
})