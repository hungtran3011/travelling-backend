import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccommodationsService } from './accommodations.service';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { TablesInsert, TablesUpdate } from '../supabase/schema';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Accommodations')
@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  // =========== ACCOMMODATION ENDPOINTS ===========

  @Get()
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved all accommodations successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllAccommodations() {
    return this.accommodationsService.getAll();
  }

  @Get(':id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved accommodation successfully.' })
  @ApiResponse({ status: 404, description: 'Accommodation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAccommodationById(@Param('id') id: string) {
    return this.accommodationsService.getAccommodationById(id);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication.',
  })
  @ApiResponse({ status: 201, description: 'Created accommodation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createAccommodation(
    @Body('placeData') placeData: TablesInsert<'places'>,
    @Body('accommodationData') accommodationData: TablesInsert<'accommodations'>,
    @Body('units') units: TablesInsert<'accom_units'>[],
    @Body('amenities') amenities: { amenityId: string; price?: number }[],
  ) {
    return this.accommodationsService.createAccommodation(
      placeData,
      accommodationData,
      units,
      amenities,
    );
  }

  @Put(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiResponse({ status: 200, description: 'Updated accommodation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Accommodation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateAccommodation(
    @Param('id') id: string,
    @Body('placeData') placeData?: TablesUpdate<'places'>,
    @Body('accommodationData') accommodationData?: TablesUpdate<'accommodations'>,
  ) {
    return this.accommodationsService.updateAccommodation(
      id,
      placeData,
      accommodationData,
    );
  }

  @Delete(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted accommodation successfully.' })
  @ApiResponse({ status: 404, description: 'Accommodation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteAccommodation(@Param('id') id: string) {
    await this.accommodationsService.deleteAccommodation(id);
  }

  // =========== ACCOMMODATION UNIT ENDPOINTS ===========

  @Get(':accommodationId/units')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved units successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUnitsByAccommodationId(@Param('accommodationId') accommodationId: string) {
    return this.accommodationsService.getUnitsByAccommodationId(accommodationId);
  }

  @Get('units/:id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved unit successfully.' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUnitById(@Param('id') id: string) {
    return this.accommodationsService.getUnitById(id);
  }

  @Post('units')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiResponse({ status: 201, description: 'Created unit successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createUnit(@Body() unit: TablesInsert<'accom_units'>) {
    return this.accommodationsService.createUnit(unit);
  }

  @Put('units/:id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @ApiResponse({ status: 200, description: 'Updated unit successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateUnit(
    @Param('id') id: string,
    @Body() unit: TablesUpdate<'accom_units'>,
  ) {
    return this.accommodationsService.updateUnit(id, unit);
  }

  @Delete('units/:id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token for CSRF protection.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted unit successfully.' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUnit(@Param('id') id: string) {
    await this.accommodationsService.deleteUnit(id);
  }

  // =========== AMENITY ENDPOINTS ===========

  @Get('amenities')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved amenities successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllAmenities() {
    return this.accommodationsService.getAllAmenities();
  }

  @Get('amenities/:id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved amenity successfully.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAmenityById(@Param('id') id: string) {
    return this.accommodationsService.getAmenityById(id);
  }

  @Post('amenities')
  @ApiResponse({ status: 201, description: 'Created amenity successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createAmenity(@Body() amenity: TablesInsert<'amenities'>) {
    return this.accommodationsService.createAmenity(amenity);
  }

  @Put('amenities/:id')
  @ApiResponse({ status: 200, description: 'Updated amenity successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateAmenity(
    @Param('id') id: string,
    @Body() amenity: TablesUpdate<'amenities'>,
  ) {
    return this.accommodationsService.updateAmenity(id, amenity);
  }

  @Delete('amenities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted amenity successfully.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteAmenity(@Param('id') id: string) {
    await this.accommodationsService.deleteAmenity(id);
  }

  // =========== ACCOMMODATION AMENITY MAPPING ENDPOINTS ===========

  @Get(':id/amenities')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved accommodation amenities successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAmenitiesByAccommodationId(@Param('id') id: string) {
    return this.accommodationsService.getAmenitiesByAccommodationId(id);
  }

  @Post(':id/amenities')
  @ApiResponse({ status: 201, description: 'Added amenity to accommodation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addAmenityToAccommodation(
    @Param('id') id: string,
    @Body() body: { amenityId: string; price?: number },
  ) {
    return this.accommodationsService.addAmenityToAccommodation(
      id,
      body.amenityId,
      body.price,
    );
  }

  @Put('accommodation-amenities/:id')
  @ApiResponse({ status: 200, description: 'Updated accommodation amenity successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Accommodation amenity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateAccommodationAmenity(
    @Param('id') id: string,
    @Body() body: { price: number },
  ) {
    return this.accommodationsService.updateAccommodationAmenity(id, body.price);
  }

  @Delete('accommodation-amenities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Removed amenity from accommodation successfully.' })
  @ApiResponse({ status: 404, description: 'Accommodation amenity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async removeAmenityFromAccommodation(@Param('id') id: string) {
    await this.accommodationsService.removeAmenityFromAccommodation(id);
  }
}
