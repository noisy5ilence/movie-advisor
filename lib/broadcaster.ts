import { EventEmitter } from 'events';

class RequestTokenBroadcaster extends EventEmitter {}
const requestTokenBroadcaster = new RequestTokenBroadcaster();

export default requestTokenBroadcaster;
