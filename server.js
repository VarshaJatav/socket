
import { createServer } from 'node:net';

const server = createServer();

let clientsConnected = 0;
const result = [];

server.on('connection', (socket) => {
  console.log(`Client connected on: ${socket.remoteAddress}: ${socket.remotePort}`);
  clientsConnected += 1;
  console.log(`Clients Connected: ${clientsConnected}`);
  socket.write(`Try to use these commands :
  create pair key value;    -for creating one key value pair
  list;                     -for showing all key value pairs
  get key key;              -for showing specific key value pair
  delete key;               -for deleting specific key value pair
  clients;                  -for showing number of clients connected.`)

  socket.on('data', (data) => {
    const pair = {}
    const inputArray = data.toString('utf-8').trim().split(" ");

    // Create entry
    if (inputArray[0] === 'create' && inputArray[1] === 'pair') {
      if (!inputArray[2] || !inputArray[3]) {
        socket.write('something is missing from your command.')
      }
      else {
        const key = inputArray[2];
        const entry = result.find((item) => {
          return Object.keys(item) == key;
        });
        if (entry) {
          socket.write('key already exists, try another.');
        }
        else {
          pair[inputArray[2]] = inputArray[3]
          result.push(pair);
          socket.write(`201: Created`)
          socket.write(JSON.stringify(pair));
        }
      }
    }

    // number of clients
    else if (inputArray[0] === 'clients') {
      socket.write(`200: OK`)
      socket.write(`number of clients connected: ${clientsConnected.toString()}`);
    }

    // list entries
    else if (inputArray[0] === 'list') {
      socket.write(`200: OK`)
      socket.write(JSON.stringify(result));
    }

    // get entry
    else if (inputArray[0] === 'get' && inputArray[1] === 'key') {
      const key = inputArray[2];
      const value = result.find((item) => {
        return Object.keys(item) == key;
      });
      if (!value) {
        socket.write('invalid key!!')
      } else {
        socket.write('200: OK')
        socket.write(JSON.stringify(value))
      }
    }

    //  delete entry
    else if (inputArray[0] === 'delete') {
      const toDelete = inputArray[1];
      const deleted = result.findIndex((item) => {
        return Object.keys(item) == toDelete;
      });
      if (deleted === -1) {
        socket.write('invalid key!!')
      } else {
        result.splice(deleted, 1)
        socket.write('200: OK')
        socket.write('entry deleted successfully!!')
      }
    }

    else {
      socket.write('invalid command.')
    }
  })

  socket.on('end', () => {
    console.log(`Client exited on: ${socket.remoteAddress}:${socket.remotePort}`)
    clientsConnected -= 1
    console.log(`Clients Connected: ${clientsConnected}`)
  }
  )
})

server.listen(3300, () => {
  console.log(`Server open on: ${server.address().address}: ${server.address().port}`);
})
