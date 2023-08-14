## This package implements the conversion for the available coingecko API or coinmarketcap API.

Example:

```js
@Module({
  imports: [
    RateModule.forRoot({ provider: Provider.COINGECKO }),
  ],
})
```

```js
await this.rateService.equivalent('usd')('eth')(amount);
```