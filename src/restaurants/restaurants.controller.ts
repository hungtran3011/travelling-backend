import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { TablesInsert, TablesUpdate } from '../supabase/schema';
import { CsrfGuard } from 'src/auth/csrf.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { RestaurantsDocsApiResponse, RestaurantsDocsApiBody } from './docs/restaurants.docs';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // =========== RESTAURANT ENDPOINTS ===========

  @Get()
  @Public()
  @ApiResponse(RestaurantsDocsApiResponse.getAllRestaurants.success)
  @ApiResponse(RestaurantsDocsApiResponse.getAllRestaurants.serverError)
  async getAllRestaurants() {
    return this.restaurantsService.getAll();
  }

  @Get(':id')
  @Public()
  @ApiQuery({ name: 'simple', required: false, type: Boolean, description: 'Return simplified data' })
  @ApiQuery({ name: 'menu_items', required: false, type: Boolean, description: 'Include menu items' })
  @ApiQuery({ name: 'tables', required: false, type: Boolean, description: 'Include tables' })
  @ApiResponse(RestaurantsDocsApiResponse.getRestaurantById.success)
  @ApiResponse(RestaurantsDocsApiResponse.getRestaurantById.notFound)
  @ApiResponse(RestaurantsDocsApiResponse.getRestaurantById.serverError)
  async getRestaurantById(
    @Param('id') id: string,
    @Query('simple') simple: boolean = false,
    @Query('menu_items') menuItems: boolean = false,
    @Query('tables') tables: boolean = false
  ) {
    return this.restaurantsService.getRestaurantById(id, simple, menuItems, tables);
  }

  @Post()
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.createRestaurant)
  @ApiResponse({ status: 201, description: 'Created restaurant successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createRestaurant(
    @Body('placeData') placeData: TablesInsert<'places'>,
    @Body('restaurantData') restaurantData: TablesInsert<'restaurants'>,
    @Body('menuItems') menuItems?: TablesInsert<'restaurant_menu_item'>[],
    @Body('tables') tables?: TablesInsert<'restaurant_tables'>[]
  ) {
    return this.restaurantsService.createRestaurant(
      placeData,
      restaurantData,
      menuItems,
      tables
    );
  }

  @Post(':id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.updateRestaurant)
  @ApiResponse({ status: 200, description: 'Updated restaurant successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateRestaurant(
    @Param('id') id: string,
    @Body('placeData') placeData?: TablesUpdate<'places'>,
    @Body('restaurantData') restaurantData?: TablesUpdate<'restaurants'>
  ) {
    return this.restaurantsService.updateRestaurant(id, placeData, restaurantData);
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
  @ApiResponse({ status: 204, description: 'Deleted restaurant successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteRestaurant(@Param('id') id: string) {
    await this.restaurantsService.deleteRestaurant(id);
  }

  // =========== MENU ITEM ENDPOINTS ===========

  @Get(':restaurantId/menu-items')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved menu items successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMenuItemsByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.getMenuItemsByRestaurantId(restaurantId);
  }

  @Get('menu-items/:id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved menu item successfully.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMenuItemById(@Param('id') id: string) {
    return this.restaurantsService.getMenuItemById(id);
  }

  @Post('menu-items')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.createMenuItem)
  @ApiResponse({ status: 201, description: 'Created menu item successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createMenuItem(@Body() menuItem: TablesInsert<'restaurant_menu_item'>) {
    return this.restaurantsService.createMenuItem(menuItem);
  }

  @Post('menu-items/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.updateMenuItem)
  @ApiResponse({ status: 200, description: 'Updated menu item successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() menuItem: TablesUpdate<'restaurant_menu_item'>
  ) {
    return this.restaurantsService.updateMenuItem(id, menuItem);
  }

  @Delete('menu-items/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted menu item successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteMenuItem(@Param('id') id: string) {
    await this.restaurantsService.deleteMenuItem(id);
  }

  // =========== RESTAURANT TABLE ENDPOINTS ===========

  @Get(':restaurantId/tables')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved restaurant tables successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTablesByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.getTablesByRestaurantId(restaurantId);
  }

  @Get('tables/:id')
  @Public()
  @ApiResponse({ status: 200, description: 'Retrieved restaurant table successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTableById(@Param('id') id: string) {
    return this.restaurantsService.getTableById(id);
  }

  @Post('tables')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.createTable)
  @ApiResponse({ status: 201, description: 'Created restaurant table successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createTable(@Body() table: TablesInsert<'restaurant_tables'>) {
    return this.restaurantsService.createTable(table);
  }

  @Put('tables/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody(RestaurantsDocsApiBody.updateTable)
  @ApiResponse({ status: 200, description: 'Updated restaurant table successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateTable(
    @Param('id') id: string,
    @Body() table: TablesUpdate<'restaurant_tables'>
  ) {
    return this.restaurantsService.updateTable(id, table);
  }

  @Delete('tables/:id')
  @UseGuards(AuthGuard, CsrfGuard)
  @ApiHeader({
    name: 'X-CSRF-TOKEN',
    description: 'CSRF token for CSRF protection',
    required: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted restaurant table successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteTable(@Param('id') id: string) {
    await this.restaurantsService.deleteTable(id);
  }
}
