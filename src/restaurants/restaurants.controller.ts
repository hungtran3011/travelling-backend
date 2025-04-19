import { Body, Controller, Delete, Get, Param, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { TablesInsert, TablesUpdate } from '../supabase/schema';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // =========== RESTAURANT ENDPOINTS ===========

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieved all restaurants successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllRestaurants() {
    return this.restaurantsService.getAllRestaurants();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved restaurant successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getRestaurantById(@Param('id') id: string) {
    return this.restaurantsService.getRestaurantById(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Created restaurant successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
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

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Updated restaurant successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted restaurant successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteRestaurant(@Param('id') id: string) {
    await this.restaurantsService.deleteRestaurant(id);
  }

  // =========== MENU ITEM ENDPOINTS ===========

  @Get(':restaurantId/menu-items')
  @ApiResponse({ status: 200, description: 'Retrieved menu items successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMenuItemsByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.getMenuItemsByRestaurantId(restaurantId);
  }

  @Get('menu-items/:id')
  @ApiResponse({ status: 200, description: 'Retrieved menu item successfully.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getMenuItemById(@Param('id') id: string) {
    return this.restaurantsService.getMenuItemById(id);
  }

  @Post('menu-items')
  @ApiResponse({ status: 201, description: 'Created menu item successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createMenuItem(@Body() menuItem: TablesInsert<'restaurant_menu_item'>) {
    return this.restaurantsService.createMenuItem(menuItem);
  }

  @Put('menu-items/:id')
  @ApiResponse({ status: 200, description: 'Updated menu item successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateMenuItem(
    @Param('id') id: string,
    @Body() menuItem: TablesUpdate<'restaurant_menu_item'>
  ) {
    return this.restaurantsService.updateMenuItem(id, menuItem);
  }

  @Delete('menu-items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted menu item successfully.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteMenuItem(@Param('id') id: string) {
    await this.restaurantsService.deleteMenuItem(id);
  }

  // =========== RESTAURANT TABLE ENDPOINTS ===========

  @Get(':restaurantId/tables')
  @ApiResponse({ status: 200, description: 'Retrieved restaurant tables successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTablesByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.restaurantsService.getTablesByRestaurantId(restaurantId);
  }

  @Get('tables/:id')
  @ApiResponse({ status: 200, description: 'Retrieved restaurant table successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTableById(@Param('id') id: string) {
    return this.restaurantsService.getTableById(id);
  }

  @Post('tables')
  @ApiResponse({ status: 201, description: 'Created restaurant table successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createTable(@Body() table: TablesInsert<'restaurant_tables'>) {
    return this.restaurantsService.createTable(table);
  }

  @Put('tables/:id')
  @ApiResponse({ status: 200, description: 'Updated restaurant table successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateTable(
    @Param('id') id: string,
    @Body() table: TablesUpdate<'restaurant_tables'>
  ) {
    return this.restaurantsService.updateTable(id, table);
  }

  @Delete('tables/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Deleted restaurant table successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant table not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteTable(@Param('id') id: string) {
    await this.restaurantsService.deleteTable(id);
  }
}
