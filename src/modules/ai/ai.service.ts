import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async chat(userId: string, message: string, conversationId?: string) {
    let conversation;
    if (conversationId) {
      conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation || conversation.userId !== userId) {
        throw new NotFoundException('Conversation not found');
      }
    } else {
      conversation = await this.prisma.conversation.create({
        data: {
          userId,
          title: message.substring(0, 100),
        },
      });
    }

    await this.prisma.message.create({
      data: {
        content: message,
        role: 'user',
        conversationId: conversation.id,
      },
    });

    const apiKey = this.configService.get('openai.apiKey');
    let reply: string;

    if (!apiKey || apiKey.startsWith('sk-your')) {
      reply = this.getMockReply(message);
    } else {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey });

        const history = await this.prisma.message.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: 'asc' },
          take: 20,
        });

        const messages = history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        const completion = await openai.chat.completions.create({
          model: this.configService.get('openai.model', 'gpt-4o'),
          messages: [
            {
              role: 'system',
              content: 'You are AgriSmart AI, an agricultural assistant helping Indian farmers with crop management, weather, soil, irrigation, and farming best practices. Respond in a helpful, practical manner.',
            },
            ...messages,
          ],
        });

        reply = completion.choices[0].message.content;
      } catch (error) {
        this.logger.error('OpenAI API error', error);
        reply = this.getMockReply(message);
      }
    }

    await this.prisma.message.create({
      data: {
        content: reply,
        role: 'assistant',
        conversationId: conversation.id,
      },
    });

    return {
      conversationId: conversation.id,
      reply,
    };
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });
    if (!conversation || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.message.deleteMany({ where: { conversationId: id } });
    await this.prisma.conversation.delete({ where: { id } });
    return { message: 'Conversation deleted successfully' };
  }

  private getMockReply(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('crop') || lower.includes('farming')) {
      return 'For optimal crop management, ensure proper soil preparation, use quality seeds, and maintain adequate irrigation. Consider soil testing before planting to determine nutrient needs.';
    }
    if (lower.includes('weather')) {
      return 'Check local weather forecasts regularly. In monsoon season, ensure proper drainage. During dry periods, increase irrigation frequency and consider mulching to retain moisture.';
    }
    if (lower.includes('pest') || lower.includes('disease')) {
      return 'Integrated Pest Management (IPM) is recommended. Use biological controls first, then organic pesticides if needed. Regular field monitoring helps catch issues early.';
    }
    return 'I am AgriSmart AI, your agricultural assistant. I can help you with crop management, weather information, pest control, irrigation planning, and farming best practices. What would you like to know?';
  }
}
