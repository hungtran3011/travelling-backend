import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SightseeingService } from './sightseeing.service';
import { SightseeingServiceData } from './dto/sightseeing.dto';

@ApiTags('Sightseeing')
@Controller('sightseeing')
export class SightseeingController {
  constructor(private readonly sightseeingService: SightseeingService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieved all sightseeing places successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getSightseeing() {
    return this.sightseeingService.getSightseeing();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved sightseeing place successfully.' })
  @ApiResponse({ status: 404, description: 'Sightseeing place not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getSightseeingById(@Param('id') id: string) {
    return this.sightseeingService.getSightseeingById(id);
  }

  @Post()
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted sightseeing place successfully.' })
  @ApiResponse({ status: 404, description: 'Sightseeing place not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteSightseeing(@Param('id') id: string) {
    await this.sightseeingService.deleteSightseeing(id);
  }
}
