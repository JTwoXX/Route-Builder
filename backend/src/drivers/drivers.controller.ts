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
import { DriversService } from './drivers.service';
import { Driver } from '../common/interfaces';

@Controller('api/drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Get()
    findAll() {
        return this.driversService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const driver = this.driversService.findOne(id);
        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }

    @Post()
    create(@Body() data: Partial<Driver>) {
        return this.driversService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Driver>) {
        const driver = this.driversService.update(id, data);
        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        const deleted = this.driversService.remove(id);
        if (!deleted) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return { success: true };
    }
}
