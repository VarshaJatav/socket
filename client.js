
import { createConnection } from 'node:net';
import { stdin } from 'node:process';

const client = createConnection({ port: 3300, family: 'IPv4' }, () => {
  console.log('Connected to Server');
})

client.on('data', (data) => {
  console.log(data.toString('utf-8'));
})

stdin.on('data', (data) => {
  client.write(data);
})

client.on('end', () => {
  process.exit(0);
})
