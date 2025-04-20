import { TablesInsert } from '../../supabase/schema';

// Full Restaurant DTO (contains all fields from restaurants and places tables)
export class RestaurantDto {
  // From places table
  id: string;
  name: string | null;
  description: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  rating: string | null;
  currency: string | null;
  place_types: string | null;
  
  // From restaurants table
  cuisine_type: string | null;
  created_at: string;
}

// Basic Restaurant DTO for bulk fetching
export class RestaurantBasicDto {
  id: string;
  name: string | null;
  rating: string | null;
  cuisine_type: string | null;
  location: string | null;
}

// DTOs for creating a restaurant
export class CreateRestaurantDto {
  placeData: {
    name: string | null;
    description?: string | null;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    currency?: string | null;
    place_types?: string | null;
  };
  restaurantData: {
    cuisine_type?: string | null;
  };
}

// DTOs for updating a restaurant
export class UpdateRestaurantDto {
  placeData?: {
    name?: string | null;
    description?: string | null;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    currency?: string | null;
    place_types?: string | null;
  };
  restaurantData?: {
    cuisine_type?: string | null;
  };
}

// Menu Item DTO
export class MenuItemDto {
  id: string;
  name: string | null;
  restaurant_id: string | null;
  type: string | null;
  unit_price: number | null;
  unit_text: string | null;
  created_at: string;
}

// Restaurant Table DTO
export class RestaurantTableDto {
  id: string;
  restaurant_id: string | null;
  table_name: string | null;
  seating_capacity: number | null;
  is_available: boolean | null;
  deposit: number | null;
  created_at: string;
}

// Create Menu Item DTO
export class CreateMenuItemDto implements TablesInsert<'restaurant_menu_item'> {
  id?: string;
  name?: string | null;
  restaurant_id?: string | null;
  type?: string | null;
  unit_price?: number | null;
  unit_text?: string | null;
  created_at?: string;
}

// Create Restaurant Table DTO
export class CreateRestaurantTableDto implements TablesInsert<'restaurant_tables'> {
  id?: string;
  restaurant_id?: string | null;
  table_name?: string | null;
  seating_capacity?: number | null;
  is_available?: boolean | null;
  deposit?: number | null;
  created_at?: string;
}

export class RestaurantFull {
  restaurant: RestaurantDto;
  menuItems: MenuItemDto[];
  tables: RestaurantTableDto[];
}