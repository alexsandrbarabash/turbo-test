export interface IProvider {
  getConversionRate(
    fromToken: string,
    toToken: string,
    apiKey?: string,
  ): Promise<number>;
}
