import { io } from 'socket.io-client';

const socket = io(`${process.env.NEXT_PUBLIC_PORT}`);

export default socket;
