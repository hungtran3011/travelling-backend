import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiQuery({ name: 'status', required: false, enum: ['confirmed', 'pending', 'cancelled'] })
  @ApiQuery({ name: 'from_date', required: false, type: Date })
  @ApiQuery({ name: 'to_date', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Retrieved all reservations successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getAllReservations(
    @Query('status') status?: string,
    @Query('from_date') fromDate?: Date,
    @Query('to_date') toDate?: Date,
  ) {
    return this.reservationsService.getAll(status, fromDate, toDate);
  }

  @Get('user/:userId')
  @ApiResponse({ status: 200, description: 'Retrieved user reservations successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getUserReservations(@Param('userId') userId: string) {
    return this.reservationsService.getByUserId(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved reservation successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  getReservationById(@Param('id') id: string) {
    return this.reservationsService.getById(id);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', example: 'abc-123-def-456' },
        item_type: { type: 'string', example: 'restaurant_table', enum: ['restaurant_table', 'accom_unit'] },
        item_id: { type: 'string', example: 'table-123-456' },
        start_datetime: { type: 'string', format: 'date-time', example: '2025-05-01T18:00:00Z' },
        end_datetime: { type: 'string', format: 'date-time', example: '2025-05-01T20:00:00Z' },
        guest_count: { type: 'integer', example: 4 },
        special_requests: { type: 'string', example: 'Window table preferred' },
        status: { type: 'string', example: 'pending', enum: ['pending', 'confirmed', 'cancelled'] }
      },
      required: ['user_id', 'item_type', 'item_id', 'start_datetime', 'end_datetime', 'guest_count']
    }
  })
  @ApiResponse({ status: 201, description: 'Created reservation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict - item already reserved.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  createReservation(@Body() reservationData: any) {
    return this.reservationsService.create(reservationData);
  }

  @Put(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        start_datetime: { type: 'string', format: 'date-time', example: '2025-05-01T19:00:00Z' },
        end_datetime: { type: 'string', format: 'date-time', example: '2025-05-01T21:00:00Z' },
        guest_count: { type: 'integer', example: 5 },
        special_requests: { type: 'string', example: 'Quiet area preferred' },
        status: { type: 'string', example: 'confirmed', enum: ['pending', 'confirmed', 'cancelled'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Updated reservation successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiResponse({ status: 409, description: 'Conflict - item already reserved.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  updateReservation(@Param('id') id: string, @Body() reservationData: any) {
    return this.reservationsService.update(id, reservationData);
  }

  @Delete(':id')
  @UseGuards(CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted reservation successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  deleteReservation(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }
}
