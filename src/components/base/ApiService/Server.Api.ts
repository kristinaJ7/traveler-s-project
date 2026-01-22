import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { TourProducts } from "../../../types";
import { API_ENDPOINTS } from "../../../utils/constants";

export interface ITourServiceDependencies {
  supabaseUrl: string;
  supabaseKey: string;
}

export interface ITourService {
  fetchTours(): Promise<TourProducts[]>;
  insertContact(formData: Record<string, any>): Promise<void>; // Добавляем в интерфейс
}

export class TourService implements ITourService {
  private supabase: SupabaseClient;

  constructor(dependencies: ITourServiceDependencies) {
    this.supabase = createClient(
      dependencies.supabaseUrl,
      dependencies.supabaseKey
    );
  }

  async fetchTours(): Promise<TourProducts[]> {
    try {
      const { data, error } = await this.supabase
        .from(API_ENDPOINTS.TOURS)
        .select("*");

      if (error) throw new Error(`Ошибка загрузки туров: ${error.message}`);

      return (data as TourProducts[]) || [];
    } catch (error) {
      console.error("Ошибка в TourService.fetchTours:", error);
      throw error;
    }
  }


  // Новый метод для отправки контактов
  async insertContact(formData: Record<string, any>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("clients_contacts")
        .insert([formData]);

      if (error) throw error;
    } catch (error) {
      console.error("Ошибка вставки данных в Supabase:", error);
      throw error;
    }
    console.log('formData перед отправкой:', formData);

  }
}