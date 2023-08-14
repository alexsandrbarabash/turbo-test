import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { IProvider } from '../interface';
import { InternalServerErrorException } from '@cowchain/exceptions';

@Injectable()
export class CoinmarketcapProvider implements IProvider {
  async getConversionRate(
    fromToken: string,
    toToken: string,
    apiKey: string,
  ): Promise<number> {
    if (apiKey) {
      throw new InternalServerErrorException('Api key required');
    }

    const url = `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=${fromToken}&convert=${toToken}`;
    const options = {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    };

    try {
      const response = await axios.get(url, options);
      const data = response.data;

      if (data.status.error_code !== 0) {
        throw new Error(data.status.error_message);
      }

      const rate = data.data.quote[toToken].price;
      return rate;
    } catch (error) {
      console.log('error', error.message);
      throw new InternalServerErrorException('Error getting course');
    }
  }
}
