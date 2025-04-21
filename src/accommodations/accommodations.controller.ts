import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AccommodationsService } from './accommodations.service';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { AuthGuard } from 'src/auth/auth.guard';
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
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        placeData: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Coastal Resort' },
            description: { type: 'string', example: 'Beautiful beachfront resort with premium amenities.' },
            location: { type: 'string', example: 'Miami Beach, FL' },
            email: { type: 'string', format: 'email', example: 'contact@coastalresort.com' },
            phone: { type: 'string', example: '+1234567890' },
            website: { type: 'string', example: 'https://coastalresort.com' },
            rating: { type: 'string', example: '4.8' },
            place_types: { type: 'string', example: 'hotel,resort' },
            currency: { type: 'string', example: 'USD' }
          },
          required: ['name', 'location']
        },
        accommodationData: {
          type: 'object',
          properties: {
            checkin_time: { type: 'string', example: '15:00' },
            checkout_time: { type: 'string', example: '11:00' },
            property_type: { type: 'string', example: 'Hotel' },
            star_rating: { type: 'integer', example: 5 }
          },
          required: ['property_type']
        },
        units: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Deluxe Ocean View Suite' },
              description: { type: 'string', example: 'Spacious suite with ocean views' },
              capacity: { type: 'integer', example: 4 },
              price_per_night: { type: 'number', example: 299.99 },
              unit_type: { type: 'string', example: 'suite' },
              beds: { type: 'string', example: '1 king, 1 sofa' },
              bathrooms: { type: 'integer', example: 2 },
              size: { type: 'integer', example: 120 },
              size_unit: { type: 'string', example: 'sqm' }
            }
          }
        },
        amenities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              amenityId: { type: 'string', example: 'amenity-123' },
              price: { type: 'number', example: 25 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Created accommodation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        placeData: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Resort Name' },
            description: { type: 'string', example: 'Updated description' },
            rating: { type: 'string', example: '5.0' }
          }
        },
        accommodationData: {
          type: 'object',
          properties: {
            checkin_time: { type: 'string', example: '14:00' },
            checkout_time: { type: 'string', example: '12:00' },
            star_rating: { type: 'integer', example: 5 }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Updated accommodation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted accommodation successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Accommodation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteAccommodation(@Param('id') id: string) {
    await this.accommodationsService.deleteAccommodation(id);
  }

  // =========== ACCOMMODATION UNIT ENDPOINTS ===========

  @Get(':accommodationId/units')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved units successfully.' })
  @ApiResponse({ status: 404, description: 'Accommodation not found.' })
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
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accommodation_id: { type: 'string', example: 'accom-123-def-456' },
        name: { type: 'string', example: 'Standard Double Room' },
        description: { type: 'string', example: 'Comfortable room with city view' },
        capacity: { type: 'integer', example: 2 },
        price_per_night: { type: 'number', example: 149.99 },
        unit_type: { type: 'string', example: 'room' },
        beds: { type: 'string', example: '1 queen' },
        bathrooms: { type: 'integer', example: 1 },
        size: { type: 'integer', example: 30 },
        size_unit: { type: 'string', example: 'sqm' }
      },
      required: ['accommodation_id', 'name', 'capacity', 'price_per_night', 'unit_type']
    }
  })
  @ApiResponse({ status: 201, description: 'Created unit successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createUnit(@Body() unit: TablesInsert<'accom_units'>) {
    return this.accommodationsService.createUnit(unit);
  }

  @Put('units/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Deluxe Double Room' },
        description: { type: 'string', example: 'Updated description' },
        capacity: { type: 'integer', example: 3 },
        price_per_night: { type: 'number', example: 179.99 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Updated unit successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateUnit(
    @Param('id') id: string,
    @Body() unit: TablesUpdate<'accom_units'>,
  ) {
    return this.accommodationsService.updateUnit(id, unit);
  }

  @Delete('units/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted unit successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
