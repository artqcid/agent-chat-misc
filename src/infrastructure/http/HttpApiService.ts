// src/infrastructure/http/HttpApiService.ts
import * as http from 'http';
import { IChatService } from '../../core/interfaces/IChatService';

export class HttpApiService {
  private server: http.Server | null = null;

  constructor(private chatService: IChatService) {}

  start(port: number): void {
    this.server = http.createServer(this.handleRequest.bind(this));

    this.server.listen(port, () => {
      console.log(`Agent Chat API server listening on port ${port}`);
    });
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/chat') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { message, systemPrompt } = JSON.parse(body);
          const reply = await this.chatService.sendMessage(message, systemPrompt);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }
}