import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(url: string) {
    console.log('Email sent to: ', url);
  }
}
