import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send message to AI assistant' })
  async chat(
    @CurrentUser('id') userId: string,
    @Body() body: { message: string; conversationId?: string },
  ) {
    return this.aiService.chat(userId, body.message, body.conversationId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  async getConversations(@CurrentUser('id') userId: string) {
    return this.aiService.getConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation with messages' })
  async getConversation(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.getConversation(id, userId);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.deleteConversation(id, userId);
  }
}
