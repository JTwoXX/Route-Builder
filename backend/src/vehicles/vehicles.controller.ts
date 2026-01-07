import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from '../common/interfaces';

@Controller('api/vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) { }

    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const vehicle = this.vehiclesService.findOne(id);
        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }

    @Post()
    create(@Body() data: Partial<Vehicle>) {
        return this.vehiclesService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Vehicle>) {
        const vehicle = this.vehiclesService.update(id, data);
        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        const deleted = this.vehiclesService.remove(id);
        if (!deleted) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return { success: true };
    }
}
