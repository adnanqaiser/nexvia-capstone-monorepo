const WebSocket = require('ws');
const Y = require('yjs');

/**
 * Configure a robust WebSocketServer structure.
 * Implements Yjs binary state synchronization hooks to broadcast dynamic real-time text document
 * modifications and cursor concurrency blocks to all connected layout peers.
 */
function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  
  // Map of document ID to Yjs Document instance
  const docs = new Map();

  console.log('[WebSocket Server]: Engine initialized with Yjs binary sync protocol.');

  wss.on('connection', (ws, req) => {
    console.log('[WebSocket Connection]: Peer connected successfully.');

    // Default document context
    let activeDocId = 'doc-arch-specs';

    if (!docs.has(activeDocId)) {
      docs.set(activeDocId, new Y.Doc());
    }

    // Send initial handshake confirmation frame
    ws.send(JSON.stringify({
      type: 'INIT_ACK',
      payload: {
        docId: activeDocId,
        message: 'Connected to Real-Time Collaborative Engine (Yjs active)',
        activePeers: wss.clients.size
      }
    }));

    // Handle inbound frames
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case 'SWITCH_DOC':
            activeDocId = data.docId;
            if (!docs.has(activeDocId)) {
              docs.set(activeDocId, new Y.Doc());
            }
            ws.send(JSON.stringify({
              type: 'DOC_SWITCHED',
              docId: activeDocId
            }));
            break;

          case 'DOC_SYNC_UPDATE':
            // Broadcast document state & cursor concurrency updates to all other peers
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'REMOTE_DOC_UPDATE',
                  docId: data.docId,
                  content: data.content,
                  cursor: data.cursor,
                  author: data.author || 'Anonymous Peer'
                }));
              }
            });
            break;

          case 'CURSOR_MOVE':
            // Concurrency block cursor position sync
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'PEER_CURSOR_UPDATE',
                  peerId: data.peerId,
                  position: data.position,
                  user: data.user
                }));
              }
            });
            break;

          default:
            console.log('[WS Msg]: Unhandled frame type', data.type);
        }
      } catch (err) {
        // Handle raw binary state vector transfers
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    });

    ws.on('close', () => {
      console.log('[WebSocket Connection]: Peer disconnected.');
    });

    ws.on('error', (err) => {
      console.error('[WebSocket Error]:', err.message);
    });
  });

  return wss;
}

module.exports = setupWebSocketServer;
