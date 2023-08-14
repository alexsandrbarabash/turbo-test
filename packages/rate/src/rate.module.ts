import { Module, Global } from '@nestjs/common';

import { RateService } from './rate.service';
import { RateConfigurableModule } from './rate.module-definition';
import { CoingeckoProvider, CoinmarketcapProvider } from './providers';

@Global()
@Module({
  providers: [RateService, CoingeckoProvider, CoinmarketcapProvider],
  exports: [RateService],
})
export class RateModule extends RateConfigurableModule {}
