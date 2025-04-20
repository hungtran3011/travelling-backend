export class SightseeingServiceData {
    place_id: string | null;
    [key: string]: any;
}

export class SightseeingPlaceWithDetails {
  // From sightseeing_places
  id: string;
  operating_hours?: string | null;
  ticket_price?: number | null;
  type?: string | null;
  created_at: string;
  
  // From places
  name?: string | null;
  description?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: string | null;
  place_types?: string | null;
  currency?: string | null;
  
  // Services array
  services: SightseeingServiceData[];
}