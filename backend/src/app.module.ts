import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [RoutesModule, VehiclesModule, DriversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
