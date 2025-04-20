import { Injectable } from '@nestjs/common';
import { supabase } from 'src/supabase/supabase';
import { SightseeingServiceData, SightseeingPlaceWithDetails } from './dto/sightseeing.dto';
import IPlace from 'src/places/places.service';
import redisService from 'src/services/redis';

// Define interfaces for the returned data types
interface MediaPlace {
  id: string;
  media_url?: string | null;
  places_id: string; // Changed from places_id to match database structure
  type?: string | null;
  created_at: string | null;
}

@Injectable()
export class SightseeingService implements IPlace {
    constructor() { }

    // Get all sightseeing places with linked data from places and sightseeing_services
    async getAll(): Promise<SightseeingPlaceWithDetails[]> {
        // Try to get from cache first
        const cachedData = await redisService.get("sightseeing_places");
        if (cachedData) {
            return JSON.parse(cachedData) as SightseeingPlaceWithDetails[];
        }

        const { data: sightseeingPlaces, error: sightseeingError } = await supabase
            .from('sightseeing_places')
            .select('*');

        if (sightseeingError) {
            throw sightseeingError;
        }

        const placeIds = sightseeingPlaces.map((place) => place.id);

        const { data: places, error: placesError } = await supabase
            .from('places')
            .select('*')
            .in('id', placeIds);

        if (placesError) {
            throw placesError;
        }

        const { data: services, error: servicesError } = await supabase
            .from('sightseeing_services')
            .select('*')
            .in('place_id', placeIds);

        if (servicesError) {
            throw servicesError;
        }

        // Combine data from all tables with proper type handling
        const result: SightseeingPlaceWithDetails[] = sightseeingPlaces.map((sightseeingPlace) => {
            const linkedPlace = places.find((place) => place.id === sightseeingPlace.id) || {};
            
            // Filter out services with null place_id and ensure each service matches SightseeingServiceData
            const linkedServices: SightseeingServiceData[] = services
                .filter(service => service.place_id === sightseeingPlace.id && service.place_id !== null)
                .map(service => {
                    return {
                        ...service,
                        place_id: service.place_id as string, // Force non-null type
                    } as SightseeingServiceData;
                });

            return {
                ...sightseeingPlace,
                ...linkedPlace,
                services: linkedServices,
            } as SightseeingPlaceWithDetails;
        });

        // Cache the result
        await redisService.set("sightseeing_places", JSON.stringify(result));
        return result;
    }

    // Get a single sightseeing place by ID with linked data
    async getSightseeingById(id: string): Promise<SightseeingPlaceWithDetails> {
        // Try to get from cache first
        const cachedData = await redisService.get(`sightseeing_place_${id}`);
        if (cachedData) {
            return JSON.parse(cachedData) as SightseeingPlaceWithDetails;
        }

        const { data: sightseeingPlace, error: sightseeingError } = await supabase
            .from('sightseeing_places')
            .select('*')
            .eq('id', id)
            .single();

        if (sightseeingError) {
            throw sightseeingError;
        }

        const { data: place, error: placeError } = await supabase
            .from('places')
            .select('*')
            .eq('id', id)
            .single();

        if (placeError) {
            throw placeError;
        }

        const { data: services, error: servicesError } = await supabase
            .from('sightseeing_services')
            .select('*')
            .eq('place_id', id);

        if (servicesError) {
            throw servicesError;
        }

        const result: SightseeingPlaceWithDetails = {
            ...sightseeingPlace,
            ...place,
            services,
        };

        // Cache the result
        await redisService.set(`sightseeing_place_${id}`, JSON.stringify(result));
        return result;
    }

    async getMediaById(id: string): Promise<MediaPlace[]> {
        // Try to get from cache first
        const cachedData = await redisService.get(`sightseeing_media_${id}`);
        if (cachedData) {
            return JSON.parse(cachedData) as MediaPlace[];
        }

        const { data: media, error: mediaError } = await supabase
            .from('media_places')
            .select('*')
            .eq('place_id', id);

        if (mediaError) {
            throw mediaError;
        }

        // Cache the result
        await redisService.set(`sightseeing_media_${id}`, JSON.stringify(media));
        return media as MediaPlace[]; // Add explicit type cast here
    }

    // Create a new sightseeing place with linked place and services
    async createSightseeing(
        sightseeingData: any,
        placeData: any,
        servicesData: SightseeingServiceData[]
    ) {
        const { data: place, error: placeError } = await supabase
            .from('places')
            .insert(placeData)
            .select()
            .single();

        if (placeError) {
            throw placeError;
        }

        const { data: sightseeingPlace, error: sightseeingError } = await supabase
            .from('sightseeing_places')
            .insert({ ...sightseeingData, id: place.id })
            .select()
            .single();

        if (sightseeingError) {
            throw sightseeingError;
        }

        const servicesWithPlaceId: SightseeingServiceData[] = servicesData.map(
            (service: SightseeingServiceData) => ({
                ...service,
                place_id: place.id,
            })
        );

        const { error: servicesError } = await supabase
            .from('sightseeing_services')
            .insert(servicesWithPlaceId);

        if (servicesError) {
            throw servicesError;
        }

        const result = {
            ...sightseeingPlace,
            ...place,
            services: servicesWithPlaceId,
        };

        // Invalidate cache
        await redisService.del("sightseeing_places");
        await redisService.set(`sightseeing_place_${place.id}`, JSON.stringify(result));

        return result;
    }

    // Update a sightseeing place, its linked place, and services
    async updateSightseeing(
        id: string,
        sightseeingData: any,
        placeData: any,
        servicesData: SightseeingServiceData[]
    ) {
        const { error: placeError } = await supabase
            .from('places')
            .update(placeData)
            .eq('id', id);

        if (placeError) {
            throw placeError;
        }

        const { error: sightseeingError } = await supabase
            .from('sightseeing_places')
            .update(sightseeingData)
            .eq('id', id);

        if (sightseeingError) {
            throw sightseeingError;
        }

        // Delete existing services for the place
        const { error: deleteServicesError } = await supabase
            .from('sightseeing_services')
            .delete()
            .eq('place_id', id);

        if (deleteServicesError) {
            throw deleteServicesError;
        }

        // Insert updated services
        const servicesWithPlaceId: SightseeingServiceData[] = servicesData.map(
            (service: SightseeingServiceData) => ({
                ...service,
                place_id: id,
            })
        );

        const { error: servicesError } = await supabase
            .from('sightseeing_services')
            .insert(servicesWithPlaceId);

        if (servicesError) {
            throw servicesError;
        }

        // Invalidate cache
        await redisService.del("sightseeing_places");
        await redisService.del(`sightseeing_place_${id}`);

        return {
            message: 'Sightseeing place updated successfully',
        };
    }

    // Delete a sightseeing place, its linked place, and services
    async deleteSightseeing(id: string) {
        const { error: servicesError } = await supabase
            .from('sightseeing_services')
            .delete()
            .eq('place_id', id);

        if (servicesError) {
            throw servicesError;
        }

        const { error: sightseeingError } = await supabase
            .from('sightseeing_places')
            .delete()
            .eq('id', id);

        if (sightseeingError) {
            throw sightseeingError;
        }

        const { error: placeError } = await supabase
            .from('places')
            .delete()
            .eq('id', id);

        if (placeError) {
            throw placeError;
        }

        // Invalidate cache
        await redisService.del("sightseeing_places");
        await redisService.del(`sightseeing_place_${id}`);
        await redisService.del(`sightseeing_media_${id}`);

        return {
            message: 'Sightseeing place deleted successfully',
        };
    }
}
