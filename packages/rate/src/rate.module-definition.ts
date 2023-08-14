import { ConfigurableModuleBuilder } from '@nestjs/common'
import { Provider } from "./enums"

const asdasd = 'sdf';

export type RateModuleOptions = {
  apiKey?: string;
  /**
   * TODO: use DI symbol
   */
  provider: Provider;
};

export const {
  ConfigurableModuleClass: RateConfigurableModule,
  MODULE_OPTIONS_TOKEN: RATE_TOKEN,
} = new ConfigurableModuleBuilder<RateModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
