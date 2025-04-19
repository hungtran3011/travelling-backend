import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase';
import { TablesInsert, TablesUpdate } from '../supabase/schema';

@Injectable()
export class RestaurantsService {
  // =========== RESTAURANT CRUD OPERATIONS ===========

  async getAllRestaurants() {
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*, places(*)');
      
    if (restaurantsError) {
      throw new Error(`Error fetching restaurants: ${restaurantsError.message}`);
    }
    
    return restaurants;
  }
  
  async getRestaurantById(id: string) {
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*, places(*)')
      .eq('id', id)
      .single();
      
    if (restaurantError) {
      throw new Error(`Error fetching restaurant: ${restaurantError.message}`);
    }
    
    // Get menu items
    const { data: menuItems, error: menuItemsError } = await supabase
      .from('restaurant_menu_item')
      .select('*')
      .eq('restaurant_id', id);
      
    if (menuItemsError) {
      throw new Error(`Error fetching menu items: ${menuItemsError.message}`);
    }
    
    // Get restaurant tables
    const { data: tables, error: tablesError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', id);
      
    if (tablesError) {
      throw new Error(`Error fetching restaurant tables: ${tablesError.message}`);
    }
    
    return {
      ...restaurant,
      menuItems,
      tables,
    };
  }
  
  async createRestaurant(
    placeData: TablesInsert<'places'>,
    restaurantData: TablesInsert<'restaurants'>,
    menuItems?: TablesInsert<'restaurant_menu_item'>[],
    tables?: TablesInsert<'restaurant_tables'>[]
  ) {
    // 1. Create place first to get the ID
    const { data: place, error: placeError } = await supabase
      .from('places')
      .insert(placeData)
      .select()
      .single();
      
    if (placeError) {
      throw new Error(`Error creating place: ${placeError.message}`);
    }
    
    // 2. Create restaurant with the place ID
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({ ...restaurantData, id: place.id })
      .select()
      .single();
      
    if (restaurantError) {
      // If restaurant creation fails, clean up the place we just created
      await supabase.from('places').delete().eq('id', place.id);
      throw new Error(`Error creating restaurant: ${restaurantError.message}`);
    }
    
    // 3. Create menu items if provided
    if (menuItems && menuItems.length > 0) {
      const menuItemsWithRestaurantId = menuItems.map(item => ({
        ...item,
        restaurant_id: place.id
      }));
      
      const { error: menuItemsError } = await supabase
        .from('restaurant_menu_item')
        .insert(menuItemsWithRestaurantId);
        
      if (menuItemsError) {
        throw new Error(`Error creating menu items: ${menuItemsError.message}`);
      }
    }
    
    // 4. Create restaurant tables if provided
    if (tables && tables.length > 0) {
      const tablesWithRestaurantId = tables.map(table => ({
        ...table,
        restaurant_id: place.id
      }));
      
      const { error: tablesError } = await supabase
        .from('restaurant_tables')
        .insert(tablesWithRestaurantId);
        
      if (tablesError) {
        throw new Error(`Error creating restaurant tables: ${tablesError.message}`);
      }
    }
    
    return this.getRestaurantById(place.id);
  }
  
  async updateRestaurant(
    id: string,
    placeData?: TablesUpdate<'places'>,
    restaurantData?: TablesUpdate<'restaurants'>
  ) {
    // Update place data if provided
    if (placeData) {
      const { error: placeError } = await supabase
        .from('places')
        .update(placeData)
        .eq('id', id);
        
      if (placeError) {
        throw new Error(`Error updating place: ${placeError.message}`);
      }
    }
    
    // Update restaurant data if provided
    if (restaurantData) {
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .update(restaurantData)
        .eq('id', id);
        
      if (restaurantError) {
        throw new Error(`Error updating restaurant: ${restaurantError.message}`);
      }
    }
    
    return this.getRestaurantById(id);
  }
  
  async deleteRestaurant(id: string) {
    // 1. Delete all menu items first (foreign key constraint)
    const { error: menuItemsError } = await supabase
      .from('restaurant_menu_item')
      .delete()
      .eq('restaurant_id', id);
      
    if (menuItemsError) {
      throw new Error(`Error deleting menu items: ${menuItemsError.message}`);
    }
    
    // 2. Delete all restaurant tables (foreign key constraint)
    const { error: tablesError } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('restaurant_id', id);
      
    if (tablesError) {
      throw new Error(`Error deleting restaurant tables: ${tablesError.message}`);
    }
    
    // 3. Delete the restaurant
    const { error: restaurantError } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);
      
    if (restaurantError) {
      throw new Error(`Error deleting restaurant: ${restaurantError.message}`);
    }
    
    // 4. Delete the place
    const { error: placeError } = await supabase
      .from('places')
      .delete()
      .eq('id', id);
      
    if (placeError) {
      throw new Error(`Error deleting place: ${placeError.message}`);
    }
    
    return { message: 'Restaurant deleted successfully' };
  }
  
  // =========== MENU ITEM CRUD OPERATIONS ===========
  
  async getMenuItemsByRestaurantId(restaurantId: string) {
    const { data: menuItems, error } = await supabase
      .from('restaurant_menu_item')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      throw new Error(`Error fetching menu items: ${error.message}`);
    }
    
    return menuItems;
  }
  
  async getMenuItemById(id: string) {
    const { data: menuItem, error } = await supabase
      .from('restaurant_menu_item')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new Error(`Error fetching menu item: ${error.message}`);
    }
    
    return menuItem;
  }
  
  async createMenuItem(menuItem: TablesInsert<'restaurant_menu_item'>) {
    const { data, error } = await supabase
      .from('restaurant_menu_item')
      .insert(menuItem)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error creating menu item: ${error.message}`);
    }
    
    return data;
  }
  
  async updateMenuItem(id: string, menuItem: TablesUpdate<'restaurant_menu_item'>) {
    const { data, error } = await supabase
      .from('restaurant_menu_item')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error updating menu item: ${error.message}`);
    }
    
    return data;
  }
  
  async deleteMenuItem(id: string) {
    const { error } = await supabase
      .from('restaurant_menu_item')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Error deleting menu item: ${error.message}`);
    }
    
    return { message: 'Menu item deleted successfully' };
  }
  
  // =========== RESTAURANT TABLE CRUD OPERATIONS ===========
  
  async getTablesByRestaurantId(restaurantId: string) {
    const { data: tables, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      throw new Error(`Error fetching restaurant tables: ${error.message}`);
    }
    
    return tables;
  }
  
  async getTableById(id: string) {
    const { data: table, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new Error(`Error fetching restaurant table: ${error.message}`);
    }
    
    return table;
  }
  
  async createTable(table: TablesInsert<'restaurant_tables'>) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .insert(table)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error creating restaurant table: ${error.message}`);
    }
    
    return data;
  }
  
  async updateTable(id: string, table: TablesUpdate<'restaurant_tables'>) {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .update(table)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error updating restaurant table: ${error.message}`);
    }
    
    return data;
  }
  
  async deleteTable(id: string) {
    const { error } = await supabase
      .from('restaurant_tables')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Error deleting restaurant table: ${error.message}`);
    }
    
    return { message: 'Restaurant table deleted successfully' };
  }
}
