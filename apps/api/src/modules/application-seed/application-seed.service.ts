import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationSeedService {
  async plant() {
    console.log('Seed start filling');
  }
}
