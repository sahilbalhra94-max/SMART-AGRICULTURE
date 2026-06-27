import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyWeather(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('weather:update', data);
  }

  notifyDisease(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('disease:alert', data);
  }

  notifyIrrigation(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('irrigation:update', data);
  }

  notifyMarket(userId: string, data: any) {
    this.server.to(`user:${userId}`).emit('market:update', data);
  }

  joinUserRoom(client: Socket, userId: string) {
    client.join(`user:${userId}`);
  }
}
