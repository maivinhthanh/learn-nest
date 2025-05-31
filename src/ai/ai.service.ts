import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async suggestNext(title: string, content: string): Promise<string> {
    const prompt = `Tiêu đề truyện: ${title}\n\nNội dung hiện tại:\n${content}\n\nViết tiếp truyện với văn phong tương tự, từ 3 đến 5 câu:`;

    const chatCompletion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    return chatCompletion.choices?.[0]?.message?.content?.trim() ?? '';
  }
}
