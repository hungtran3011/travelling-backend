import { Injectable } from '@nestjs/common';
import { supabase } from 'src/supabase/supabase';
import { SightseeingServiceData } from './dto/sightseeing.dto';

@Injectable()
export class SightseeingService {
    constructor() { }

    // Get all sightseeing places with linked data from places and sightseeing_services
    async getSightseeing() {
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

        // Combine data from all tables
        return sightseeingPlaces.map((sightseeingPlace) => {
            const linkedPlace = places.find((place) => place.id === sightseeingPlace.id);
            const linkedServices = services.filter((service) => service.place_id === sightseeingPlace.id);

            return {
                ...sightseeingPlace,
                ...linkedPlace,
                services: linkedServices,
            };
        });
    }

    // Get a single sightseeing place by ID with linked data
    async getSightseeingById(id: string) {
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

        return {
            ...sightseeingPlace,
            ...place,
            services,
        };
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

        return {
            ...sightseeingPlace,
            ...place,
            services: servicesWithPlaceId,
        };
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

        return {
            message: 'Sightseeing place deleted successfully',
        };
    }
}
