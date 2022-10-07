import { Module } from '@nestjs/common';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [DemoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
