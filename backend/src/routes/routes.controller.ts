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
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto, OptimizeRouteDto } from './dto/route.dto';

@Controller('api/routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Get()
    findAll() {
        return this.routesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const route = this.routesService.findOne(id);
        if (!route) {
            throw new NotFoundException(`Route with ID ${id} not found`);
        }
        return route;
    }

    @Post()
    create(@Body() createRouteDto: CreateRouteDto) {
        return this.routesService.create(createRouteDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
        const route = this.routesService.update(id, updateRouteDto);
        if (!route) {
            throw new NotFoundException(`Route with ID ${id} not found`);
        }
        return route;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        const deleted = this.routesService.remove(id);
        if (!deleted) {
            throw new NotFoundException(`Route with ID ${id} not found`);
        }
        return { success: true };
    }

    @Post(':id/optimize')
    optimize(@Param('id') id: string, @Body() optimizeDto: OptimizeRouteDto) {
        const route = this.routesService.optimize(id, optimizeDto);
        if (!route) {
            throw new NotFoundException(`Route with ID ${id} not found`);
        }
        return route;
    }
}
