import { v4 as uuidv4 } from 'uuid';

export function Alert(msg, type) {
   this.msg = msg;
   this.type = type;
   this.id = uuidv4();
}
