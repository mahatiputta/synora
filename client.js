// Import Yjs core libraries from CDN
import * as Y from 'https://esm.sh/yjs@13';
import { QuillBinding } from 'https://esm.sh/y-quill@1';

// 1. Initialize Socket.io
const socket = io();

// 2. Initialize Quill Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Start collaborating...'
});

// 3. Initialize Yjs Document (This handles the conflict resolution)
const ydoc = new Y.Doc();
const ytext = ydoc.getText('quill');

// Bind Yjs to our Quill Editor
const binding = new QuillBinding(ytext, quill);

// 4. Send local changes to the server
ydoc.on('update', (update) => {
    // Send raw Yjs update array directly to the Node.js server
    socket.emit('document-update', update);
});

// 5. Receive external changes from the server and apply them
socket.on('document-update', (updateData) => {
    // Convert array buffer back to Uint8Array and apply
    const update = new Uint8Array(updateData);
    Y.applyUpdate(ydoc, update);
});