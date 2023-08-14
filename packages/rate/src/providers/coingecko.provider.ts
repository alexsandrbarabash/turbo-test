import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InternalServerErrorException } from '@cowchain/exceptions';

import { IProvider } from '../interface';

@Injectable()
export class CoingeckoProvider implements IProvider {
  private readonly url = 'https://api.coingecko.com/api/v3';

  async getConversionRate(fromToken: string, toToken: string): Promise<number> {
    const response = await axios.get(
      `${this.url}/simple/price?ids=${fromToken}&vs_currencies=${toToken}&include_24hr_change=true`,
    );

    const rait = response.data[fromToken][toToken];

    if (!rait) {
      throw new InternalServerErrorException('Rate not found');
    }

    return rait;
  }
}
