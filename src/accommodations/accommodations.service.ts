import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase';
import { TablesInsert, TablesUpdate } from '../supabase/schema';

@Injectable()
export class AccommodationsService {
  // =========== ACCOMMODATION CRUD OPERATIONS ===========
  
  async getAllAccommodations() {
    const { data: accommodations, error: accommodationsError } = await supabase
      .from('accommodations')
      .select('*, places(*)');
      
    if (accommodationsError) {
      throw new Error(`Error fetching accommodations: ${accommodationsError.message}`);
    }
    
    return accommodations;
  }
  
  async getAccommodationById(id: string) {
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodations')
      .select('*, places(*)')
      .eq('id', id)
      .single();
      
    if (accommodationError) {
      throw new Error(`Error fetching accommodation: ${accommodationError.message}`);
    }
    
    // Get units
    const { data: units, error: unitsError } = await supabase
      .from('accom_units')
      .select('*')
      .eq('accommodation_id', id);
      
    if (unitsError) {
      throw new Error(`Error fetching accommodation units: ${unitsError.message}`);
    }
    
    // Get amenities
    const { data: accomAmenities, error: amenitiesError } = await supabase
      .from('accom_amenities')
      .select('*, amenities(*)')
      .eq('accom_id', id);
      
    if (amenitiesError) {
      throw new Error(`Error fetching accommodation amenities: ${amenitiesError.message}`);
    }
    
    return {
      ...accommodation,
      units,
      amenities: accomAmenities,
    };
  }
  
  async createAccommodation(
    placeData: TablesInsert<'places'>,
    accommodationData: TablesInsert<'accommodations'>,
    units: TablesInsert<'accom_units'>[],
    amenities: { amenityId: string; price?: number }[]
  ) {
    // Start a transaction
    // 1. Create place first to get the ID
    const { data: place, error: placeError } = await supabase
      .from('places')
      .insert(placeData)
      .select()
      .single();
      
    if (placeError) {
      throw new Error(`Error creating place: ${placeError.message}`);
    }
    
    // 2. Create accommodation with the place ID
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodations')
      .insert({ ...accommodationData, id: place.id })
      .select()
      .single();
      
    if (accommodationError) {
      throw new Error(`Error creating accommodation: ${accommodationError.message}`);
    }
    
    // 3. Create accommodation units
    const unitsWithAccomId = units.map(unit => ({
      ...unit,
      accommodation_id: place.id
    }));
    
    const { error: unitsError } = await supabase
      .from('accom_units')
      .insert(unitsWithAccomId);
      
    if (unitsError) {
      throw new Error(`Error creating accommodation units: ${unitsError.message}`);
    }
    
    // 4. Create accommodation amenities
    const accomAmenities = amenities.map(amenity => ({
      accom_id: place.id,
      amenity_id: amenity.amenityId,
      price: amenity.price || null,
    }));
    
    const { error: amenitiesError } = await supabase
      .from('accom_amenities')
      .insert(accomAmenities);
      
    if (amenitiesError) {
      throw new Error(`Error creating accommodation amenities: ${amenitiesError.message}`);
    }
    
    return this.getAccommodationById(place.id);
  }
  
  async updateAccommodation(
    id: string,
    placeData?: TablesUpdate<'places'>,
    accommodationData?: TablesUpdate<'accommodations'>
  ) {
    // Update place
    if (placeData) {
      const { error: placeError } = await supabase
        .from('places')
        .update(placeData)
        .eq('id', id);
        
      if (placeError) {
        throw new Error(`Error updating place: ${placeError.message}`);
      }
    }
    
    // Update accommodation
    if (accommodationData) {
      const { error: accommodationError } = await supabase
        .from('accommodations')
        .update(accommodationData)
        .eq('id', id);
        
      if (accommodationError) {
        throw new Error(`Error updating accommodation: ${accommodationError.message}`);
      }
    }
    
    return this.getAccommodationById(id);
  }
  
  async deleteAccommodation(id: string) {
    // Delete accommodation amenities first (foreign key constraint)
    const { error: amenitiesError } = await supabase
      .from('accom_amenities')
      .delete()
      .eq('accom_id', id);
      
    if (amenitiesError) {
      throw new Error(`Error deleting accommodation amenities: ${amenitiesError.message}`);
    }
    
    // Delete accommodation units (foreign key constraint)
    const { error: unitsError } = await supabase
      .from('accom_units')
      .delete()
      .eq('accommodation_id', id);
      
    if (unitsError) {
      throw new Error(`Error deleting accommodation units: ${unitsError.message}`);
    }
    
    // Delete accommodation
    const { error: accommodationError } = await supabase
      .from('accommodations')
      .delete()
      .eq('id', id);
      
    if (accommodationError) {
      throw new Error(`Error deleting accommodation: ${accommodationError.message}`);
    }
    
    // Delete place
    const { error: placeError } = await supabase
      .from('places')
      .delete()
      .eq('id', id);
      
    if (placeError) {
      throw new Error(`Error deleting place: ${placeError.message}`);
    }
    
    return { message: 'Accommodation deleted successfully' };
  }
  
  // =========== ACCOMMODATION UNIT CRUD OPERATIONS ===========
  
  async getUnitsByAccommodationId(accommodationId: string) {
    const { data: units, error } = await supabase
      .from('accom_units')
      .select('*')
      .eq('accommodation_id', accommodationId);
      
    if (error) {
      throw new Error(`Error fetching accommodation units: ${error.message}`);
    }
    
    return units;
  }
  
  async getUnitById(id: string) {
    const { data: unit, error } = await supabase
      .from('accom_units')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new Error(`Error fetching accommodation unit: ${error.message}`);
    }
    
    return unit;
  }
  
  async createUnit(unit: TablesInsert<'accom_units'>) {
    const { data, error } = await supabase
      .from('accom_units')
      .insert(unit)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error creating accommodation unit: ${error.message}`);
    }
    
    return data;
  }
  
  async updateUnit(id: string, unit: TablesUpdate<'accom_units'>) {
    const { data, error } = await supabase
      .from('accom_units')
      .update(unit)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error updating accommodation unit: ${error.message}`);
    }
    
    return data;
  }
  
  async deleteUnit(id: string) {
    const { error } = await supabase
      .from('accom_units')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Error deleting accommodation unit: ${error.message}`);
    }
    
    return { message: 'Accommodation unit deleted successfully' };
  }
  
  // =========== AMENITY CRUD OPERATIONS ===========
  
  async getAllAmenities() {
    const { data: amenities, error } = await supabase
      .from('amenities')
      .select('*');
      
    if (error) {
      throw new Error(`Error fetching amenities: ${error.message}`);
    }
    
    return amenities;
  }
  
  async getAmenityById(id: string) {
    const { data: amenity, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new Error(`Error fetching amenity: ${error.message}`);
    }
    
    return amenity;
  }
  
  async createAmenity(amenity: TablesInsert<'amenities'>) {
    const { data, error } = await supabase
      .from('amenities')
      .insert(amenity)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error creating amenity: ${error.message}`);
    }
    
    return data;
  }
  
  async updateAmenity(id: string, amenity: TablesUpdate<'amenities'>) {
    const { data, error } = await supabase
      .from('amenities')
      .update(amenity)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error updating amenity: ${error.message}`);
    }
    
    return data;
  }
  
  async deleteAmenity(id: string) {
    // First check if amenity is used in any accommodation
    const { data, error: checkError } = await supabase
      .from('accom_amenities')
      .select('id')
      .eq('amenity_id', id)
      .limit(1);
      
    if (checkError) {
      throw new Error(`Error checking amenity usage: ${checkError.message}`);
    }
    
    if (data.length > 0) {
      throw new Error('Cannot delete amenity that is in use by accommodations');
    }
    
    const { error } = await supabase
      .from('amenities')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Error deleting amenity: ${error.message}`);
    }
    
    return { message: 'Amenity deleted successfully' };
  }
  
  // =========== ACCOMMODATION AMENITY MAPPING OPERATIONS ===========
  
  async getAmenitiesByAccommodationId(accommodationId: string) {
    const { data: amenities, error } = await supabase
      .from('accom_amenities')
      .select('*, amenities(*)')
      .eq('accom_id', accommodationId);
      
    if (error) {
      throw new Error(`Error fetching accommodation amenities: ${error.message}`);
    }
    
    return amenities;
  }
  
  async addAmenityToAccommodation(accomId: string, amenityId: string, price?: number) {
    const { data, error } = await supabase
      .from('accom_amenities')
      .insert({
        accom_id: accomId,
        amenity_id: amenityId,
        price,
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error adding amenity to accommodation: ${error.message}`);
    }
    
    return data;
  }
  
  async updateAccommodationAmenity(id: string, price: number) {
    const { data, error } = await supabase
      .from('accom_amenities')
      .update({ price })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Error updating accommodation amenity: ${error.message}`);
    }
    
    return data;
  }
  
  async removeAmenityFromAccommodation(id: string) {
    const { error } = await supabase
      .from('accom_amenities')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Error removing amenity from accommodation: ${error.message}`);
    }
    
    return { message: 'Amenity removed from accommodation successfully' };
  }
}
