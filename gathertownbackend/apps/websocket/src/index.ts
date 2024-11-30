import { WebSocketServer } from 'ws';
// import { User } from './User';
import dotenv from "dotenv"
import { User } from './User';
dotenv.config()

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log("User connected")
  console.log(process.env.JWT_SECRET)
  let user = new User(ws);
  ws.on('error', console.error);

  ws.on('close', () => {
    user?.destroy();
    console.log("Client left")
  });
});

