import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { supabase } from '../supabase/supabase';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/schema';

@Injectable()
export class ReservationsService {
    private readonly logger = new Logger(ReservationsService.name);

    /**
     * Retrieve all reservations with optional filters
     */
    async getAll(status?: string, fromDate?: Date, toDate?: Date): Promise<Tables<'reservations'>[]> {
        try {
            this.logger.log(`Fetching all reservations with filters: status=${status}, fromDate=${fromDate?.toISOString() || 'undefined'}, toDate=${toDate?.toISOString() || 'undefined'}`);
            
            let query = supabase
                .from('reservations')
                .select(`
                    *,
                    users (id, email, full_name),
                    restaurant_tables (id, restaurant_id, table_name, seating_capacity),
                    accom_units (id, accommodation_id, name, max_occupancy)
                `)
                .order('created_at', { ascending: false });

            // Apply filters if provided
            if (status) {
                query = query.eq('status', status);
            }
            
            if (fromDate) {
                query = query.gte('start_datetime', new Date(fromDate).toISOString());
            }
            
            if (toDate) {
                query = query.lte('end_datetime', new Date(toDate).toISOString());
            }

            const { data, error } = await query;

            if (error) {
                this.logger.error(`Error fetching reservations: ${error.message}`);
                throw new Error(`Failed to fetch reservations: ${error.message}`);
            }

            return data ?? [];
        } catch (error: unknown) {
            this.logger.error(`Exception in getAll: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Get reservations for a specific user
     */
    async getByUserId(userId: string): Promise<Tables<'reservations'>[]> {
        try {
            this.logger.log(`Fetching reservations for user: ${userId}`);
            
            // Verify user exists
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                this.logger.warn(`User not found: ${userId}`);
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    *,
                    restaurant_tables (id, restaurant_id, table_name, seating_capacity),
                    accom_units (id, accommodation_id, name, max_occupancy)
                `)
                .eq('user_id', userId)
                .order('start_datetime', { ascending: true });

            if (error) {
                this.logger.error(`Error fetching user reservations: ${error.message}`);
                throw new Error(`Failed to fetch user reservations: ${error.message}`);
            }

            return data ?? [];
        } catch (error: unknown) {
            this.logger.error(`Exception in getByUserId: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Get a specific reservation by ID
     */
    async getById(id: string): Promise<Tables<'reservations'>> {
        try {
            this.logger.log(`Fetching reservation with ID: ${id}`);
            
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    *,
                    users (id, email, full_name),
                    restaurant_tables (
                        id, restaurant_id, table_name, seating_capacity,
                        restaurants (
                            id,
                            places (id, name, location)
                        )
                    ),
                    accom_units (
                        id, accommodation_id, name, max_occupancy,
                        accommodations (
                            id,
                            places (id, name, location)
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                this.logger.error(`Error fetching reservation: ${error.message}`);
                if (error.code === 'PGRST116') {
                    throw new NotFoundException(`Reservation with ID ${id} not found`);
                }
                throw new Error(`Failed to fetch reservation: ${error.message}`);
            }

            return data;
        } catch (error: unknown) {
            this.logger.error(`Exception in getById: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Create a new reservation
     */
    async create(reservationData: TablesInsert<'reservations'>): Promise<Tables<'reservations'>> {
        try {
            this.logger.log(`Creating new reservation for ${reservationData.item_type} with ID ${reservationData.item_id}`);
            
            // Validate reservation data
            await this.validateReservationData(reservationData);
            
            // Check for availability
            await this.checkAvailability(
                reservationData.item_type,
                reservationData.item_id, 
                new Date(reservationData.start_datetime), 
                new Date(reservationData.end_datetime),
                null
            );

            // Set default status if not provided
            if (!reservationData.status) {
                reservationData.status = 'pending';
            }
            
            const { data, error } = await supabase
                .from('reservations')
                .insert(reservationData)
                .select()
                .single();

            if (error) {
                this.logger.error(`Error creating reservation: ${error.message}`);
                throw new Error(`Failed to create reservation: ${error.message}`);
            }

            // If it's a restaurant table reservation and status is confirmed, mark table as unavailable
            if (reservationData.item_type === 'restaurant_table' && reservationData.status === 'confirmed') {
                await this.updateTableAvailability(reservationData.item_id, false);
            }

            return data;
        } catch (error: unknown) {
            this.logger.error(`Exception in create: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Update an existing reservation
     */
    async update(id: string, reservationData: TablesUpdate<'reservations'>): Promise<Tables<'reservations'>> {
        try {
            this.logger.log(`Updating reservation with ID: ${id}`);
            
            // Get current reservation data
            const { data: currentReservation, error: fetchError } = await supabase
                .from('reservations')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) {
                this.logger.error(`Error fetching current reservation: ${fetchError.message}`);
                if (fetchError.code === 'PGRST116') {
                    throw new NotFoundException(`Reservation with ID ${id} not found`);
                }
                throw new Error(`Failed to fetch current reservation: ${fetchError.message}`);
            }

            // Check if dates are being updated
            if (reservationData.start_datetime || reservationData.end_datetime) {
                // Check for availability with new dates
                await this.checkAvailability(
                    currentReservation.item_type,
                    currentReservation.item_id,
                    new Date(reservationData.start_datetime || currentReservation.start_datetime),
                    new Date(reservationData.end_datetime || currentReservation.end_datetime),
                    id
                );
            }

            // Update the reservation
            const { data, error } = await supabase
                .from('reservations')
                .update(reservationData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                this.logger.error(`Error updating reservation: ${error.message}`);
                throw new Error(`Failed to update reservation: ${error.message}`);
            }

            // Handle status changes for restaurant tables
            if (currentReservation.item_type === 'restaurant_table' && 
                reservationData.status && 
                reservationData.status !== currentReservation.status) {
                    
                if (reservationData.status === 'confirmed') {
                    await this.updateTableAvailability(currentReservation.item_id, false);
                } else if (reservationData.status === 'cancelled' && currentReservation.status === 'confirmed') {
                    await this.updateTableAvailability(currentReservation.item_id, true);
                }
            }

            return data;
        } catch (error: unknown) {
            this.logger.error(`Exception in update: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Delete a reservation
     */
    async delete(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting reservation with ID: ${id}`);
            
            // Get current reservation data before deleting
            const { data: currentReservation, error: fetchError } = await supabase
                .from('reservations')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) {
                this.logger.error(`Error fetching current reservation: ${fetchError.message}`);
                if (fetchError.code === 'PGRST116') {
                    throw new NotFoundException(`Reservation with ID ${id} not found`);
                }
                throw new Error(`Failed to fetch current reservation: ${fetchError.message}`);
            }

            // Delete the reservation
            const { error } = await supabase
                .from('reservations')
                .delete()
                .eq('id', id);

            if (error) {
                this.logger.error(`Error deleting reservation: ${error.message}`);
                throw new Error(`Failed to delete reservation: ${error.message}`);
            }

            // If it's a confirmed restaurant table reservation, mark the table as available again
            if (currentReservation.item_type === 'restaurant_table' && 
                currentReservation.status === 'confirmed') {
                await this.updateTableAvailability(currentReservation.item_id, true);
            }
        } catch (error: unknown) {
            this.logger.error(`Exception in delete: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Validate reservation data
     */
    private async validateReservationData(reservationData: TablesInsert<'reservations'>): Promise<void> {
        // Check required fields
        const requiredFields = ['user_id', 'item_type', 'item_id', 'start_datetime', 'end_datetime', 'guest_count'];
        for (const field of requiredFields) {
            if (!reservationData[field]) {
                throw new BadRequestException(`Missing required field: ${field}`);
            }
        }

        // Validate item_type
        if (!['restaurant_table', 'accom_unit'].includes(reservationData.item_type)) {
            throw new BadRequestException(`Invalid item_type: ${reservationData.item_type}. Must be 'restaurant_table' or 'accom_unit'`);
        }

        // Validate dates
        const start = new Date(reservationData.start_datetime);
        const end = new Date(reservationData.end_datetime);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        if (start >= end) {
            throw new BadRequestException('Start date must be before end date');
        }

        if (start < new Date()) {
            throw new BadRequestException('Cannot create reservations in the past');
        }

        // Validate item exists
        const tableName = reservationData.item_type === 'restaurant_table' ? 'restaurant_tables' : 'accom_units';
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', reservationData.item_id)
            .single();
        Logger.log("Type of data: ", typeof data);
        if (error || !data) {
            throw new NotFoundException(`${tableName.replace('_', ' ')} with ID ${reservationData.item_id} not found`);
        }

        // Validate user exists
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', reservationData.user_id)
            .single();

        if (userError || !user) {
            throw new NotFoundException(`User with ID ${reservationData.user_id} not found`);
        }

        if (reservationData.item_type === 'restaurant_table') {
            const tableData = data as Tables<'restaurant_tables'>;
            if (tableData.seating_capacity && tableData.seating_capacity < reservationData.guest_count) {
                throw new BadRequestException(`Table capacity (${tableData.seating_capacity}) is less than requested guest count (${reservationData.guest_count})`);
            }
        }
        
        // Validate guest count for accommodation units
        if (reservationData.item_type === 'accom_unit') {
            const accommodationData = data as Tables<'accom_units'>;
            if (accommodationData.max_occupancy && accommodationData.max_occupancy < reservationData.guest_count) {
                throw new BadRequestException(`Accommodation capacity (${accommodationData.max_occupancy}) is less than requested guest count (${reservationData.guest_count})`);
            }
        }

        // Validate status if provided
        if (reservationData.status && !['pending', 'confirmed', 'cancelled', 'completed', 'no_show'].includes(reservationData.status)) {
            throw new BadRequestException(`Invalid status: ${reservationData.status}`);
        }
    }

    /**
     * Check if an item is available for the requested time period
     */
    private async checkAvailability(
        itemType: string,
        itemId: string,
        startDate: Date,
        endDate: Date,
        excludeReservationId: string | null
    ): Promise<void> {
        this.logger.log(`Checking availability for ${itemType} with ID ${itemId} from ${startDate.toISOString()} to ${endDate.toISOString()}`);
        
        // Build query to check for conflicting reservations
        let query = supabase
            .from('reservations')
            .select('*')
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .not('status', 'in', ['cancelled', 'no_show']) // Exclude cancelled and no-show reservations
            .or(`start_datetime.lt.${endDate.toISOString()},end_datetime.gt.${startDate.toISOString()}`);

        // Exclude current reservation if updating
        if (excludeReservationId) {
            query = query.neq('id', excludeReservationId);
        }

        const { data, error } = await query;

        if (error) {
            this.logger.error(`Error checking availability: ${error.message}`);
            throw new Error(`Failed to check availability: ${error.message}`);
        }

        if (data && data.length > 0) {
            const conflictingReservation = data[0];
            this.logger.warn(`${itemType} ${itemId} is not available for the requested time period. Conflicts with reservation ${conflictingReservation.id}`);
            throw new ConflictException(`${itemType.replace('_', ' ')} is already reserved during this time period`);
        }

        // For restaurant tables, also check if the table is marked as unavailable
        if (itemType === 'restaurant_table') {
            const { data: tableData, error: tableError } = await supabase
                .from('restaurant_tables')
                .select('is_available')
                .eq('id', itemId)
                .single();

            if (tableError) {
                this.logger.error(`Error checking table availability: ${tableError.message}`);
                throw new Error(`Failed to check table availability: ${tableError.message}`);
            }

            if (tableData && tableData.is_available === false) {
                this.logger.warn(`Table ${itemId} is marked as unavailable`);
                throw new ConflictException('This table is temporarily unavailable for reservations');
            }
        }
    }

    /**
     * Update table availability status
     */
    private async updateTableAvailability(tableId: string, isAvailable: boolean): Promise<void> {
        this.logger.log(`Updating table ${tableId} availability to ${isAvailable}`);
        
        const { error } = await supabase
            .from('restaurant_tables')
            .update({ is_available: isAvailable })
            .eq('id', tableId);

        if (error) {
            this.logger.error(`Error updating table availability: ${error.message}`);
            throw new Error(`Failed to update table availability: ${error.message}`);
        }
    }

    /**
     * Get available tables for a specific restaurant within a time period
     * This is an additional helpful method for restaurant reservations
     */
    async getAvailableTables(
        restaurantId: string, 
        startDateTime: string, 
        endDateTime: string, 
        guestCount: number
    ): Promise<Tables<'restaurant_tables'>[]> {
        try {
            this.logger.log(`Fetching available tables for restaurant ${restaurantId} from ${startDateTime} to ${endDateTime} for ${guestCount} guests`);
            
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new BadRequestException('Invalid date format');
            }

            if (start >= end) {
                throw new BadRequestException('Start date must be before end date');
            }

            // Get all tables for this restaurant that can accommodate the guest count
            const { data: allTables, error: tablesError } = await supabase
                .from('restaurant_tables')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('is_available', true)
                .gte('seating_capacity', guestCount)
                .order('seating_capacity', { ascending: true });
            
            if (tablesError) {
                this.logger.error(`Error fetching restaurant tables: ${tablesError.message}`);
                throw new Error(`Failed to fetch restaurant tables: ${tablesError.message}`);
            }

            if (!allTables || allTables.length === 0) {
                return [];
            }

            // Get all reservations for these tables during the specified time period
            const tableIds = allTables.map(table => table.id);
            
            const { data: reservations, error: resError } = await supabase
                .from('reservations')
                .select('*')
                .eq('item_type', 'restaurant_table')
                .in('item_id', tableIds)
                .not('status', 'in', ['cancelled', 'no_show'])
                .or(`start_datetime.lt.${end.toISOString()},end_datetime.gt.${start.toISOString()}`);
                // .filter('start_datetime', 'lt', end.toISOString())
            
            if (resError) {
                this.logger.error(`Error fetching reservations: ${resError.message}`);
                throw new Error(`Failed to fetch reservations: ${resError.message}`);
            }

            // Filter out tables that already have reservations
            const reservedTableIds = new Set(reservations?.map(res => res.item_id) || []);
            const availableTables = allTables.filter(table => !reservedTableIds.has(table.id));
            
            this.logger.log(`Found ${availableTables.length} available tables out of ${allTables.length} total tables`);
            
            return availableTables;
        } catch (error: unknown) {
            this.logger.error(`Exception in getAvailableTables: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
}
