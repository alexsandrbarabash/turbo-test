import { Controller, Get } from '@nestjs/common';

@Controller('/example')
export class ExampleController {
  @Get()
  public helloWorld(): string {
    return 'Hello world';
  }
}
