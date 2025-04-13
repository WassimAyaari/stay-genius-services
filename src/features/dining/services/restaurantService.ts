
import { Restaurant } from '@/features/dining/types';
import { 
  fetchRestaurants as fetchRestaurantsService,
  fetchRestaurantById as fetchRestaurantByIdService,
  fetchFeaturedRestaurants as fetchFeaturedRestaurantsService
} from './restaurant/fetchServices';
import {
  createRestaurant as createRestaurantService,
  updateRestaurant as updateRestaurantService,
  deleteRestaurant as deleteRestaurantService
} from './restaurant/mutationServices';

/**
 * Fetches all restaurants from the database
 */
export const fetchRestaurants = fetchRestaurantsService;

/**
 * Fetches a restaurant by its ID
 */
export const fetchRestaurantById = fetchRestaurantByIdService;

/**
 * Fetches featured restaurants from the database
 */
export const fetchFeaturedRestaurants = fetchFeaturedRestaurantsService;

/**
 * Creates a new restaurant
 */
export const createRestaurant = createRestaurantService;

/**
 * Updates an existing restaurant
 */
export const updateRestaurant = updateRestaurantService;

/**
 * Deletes a restaurant by its ID
 */
export const deleteRestaurant = deleteRestaurantService;
