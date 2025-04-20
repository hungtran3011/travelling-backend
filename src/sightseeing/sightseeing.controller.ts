import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SightseeingService } from './sightseeing.service';
import { SightseeingServiceData } from './dto/sightseeing.dto';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Sightseeing')
@Controller('sightseeing')
export class SightseeingController {
  constructor(private readonly sightseeingService: SightseeingService) {}

  @Get()
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved all sightseeing places successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getSightseeing() {
    return this.sightseeingService.getAll();
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved sightseeing place successfully.' })
  @ApiResponse({ status: 404, description: 'Sightseeing place not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getSightseeingById(@Param('id') id: string) {
    return this.sightseeingService.getSightseeingById(id);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiResponse({
    status: 201,
    description: 'Created sightseeing place successfully.',
  })
  @ApiResponse({ status: 201, description: 'Created sightseeing place successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createSightseeing(
    @Body('sightseeingData') sightseeingData: any,
    @Body('placeData') placeData: any,
    @Body('servicesData') servicesData: SightseeingServiceData[],
  ) {
    return this.sightseeingService.createSightseeing(sightseeingData, placeData, servicesData);
  }

  @Put(':id')
  @UseGuards(CsrfGuard)
  @ApiResponse({
    status: 200,
    description: 'Updated sightseeing place successfully.',
  })
  @ApiResponse({ status: 200, description: 'Updated sightseeing place successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Sightseeing place not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateSightseeing(
    @Param('id') id: string,
    @Body('sightseeingData') sightseeingData: any,
    @Body('placeData') placeData: any,
    @Body('servicesData') servicesData: SightseeingServiceData[],
  ) {
    return this.sightseeingService.updateSightseeing(id, sightseeingData, placeData, servicesData);
  }

  @Delete(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted sightseeing place successfully.' })
  @ApiResponse({ status: 404, description: 'Sightseeing place not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteSightseeing(@Param('id') id: string) {
    await this.sightseeingService.deleteSightseeing(id);
  }
}
