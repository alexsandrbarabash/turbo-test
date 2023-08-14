import { Injectable, Inject } from '@nestjs/common';
import { InternalServerErrorException } from '@cowchain/exceptions';
import { Cache } from '@cowchain/util';

import { RATE_TOKEN, RateModuleOptions } from './rate.module-definition';
import { IProvider } from './interface';
import { Provider } from './enums';
import { CoingeckoProvider, CoinmarketcapProvider } from './providers';

/**
 * TODO: use bignumber
 */
@Injectable()
export class RateService {
  private readonly providers: Map<Provider, IProvider>;
  constructor(
    @Inject(RATE_TOKEN)
    private readonly option: RateModuleOptions,
    private readonly coingeckoProvider: CoingeckoProvider,
    private readonly coinmarketcapProvider: CoinmarketcapProvider,
  ) {
    this.providers = new Map();
    this.providers.set(Provider.COINGECKO, this.coingeckoProvider);
    this.providers.set(Provider.COINMARKETCAP, this.coinmarketcapProvider);
  }

  @Cache(2000)
  private async getRate(fromToken: string, toToken: string): Promise<number> {
    const provider = this.providers.get(this.option.provider);

    if (!provider) {
      throw new InternalServerErrorException('Provider not found');
    }

    return await provider.getConversionRate(
      fromToken,
      toToken,
      this.option.apiKey,
    );
  }

  async convert({
    amount,
    fromToken,
    toToken,
  }: {
    amount: number;
    fromToken: string;
    toToken: string;
  }) {
    const rate = await this.getRate(fromToken, toToken);

    return amount * rate;
  }

  equivalent = (from: string) => (to: string) => async (amount: number) => {
    return this.convert({ fromToken: from, toToken: to, amount });
  };
}
