//=== МОДЕЛЬ ДЛЯ ТОВАРА ===

import { IEvents } from "../base/Events";
import { TourProducts } from "../../types";

export class Products {
  //ПРИВАТНЫЕ СВОЙСВА КЛАССА(только внутри класса)
  private productsList: TourProducts[] = [];
  private filteredProducts: TourProducts[] | null = null; // Хранит отфильтрованный список
  private selectedProduct: TourProducts | null = null;
   events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // МЕТОДЫ КОТОРЫЕ СОДЕРЖИТ МОДЕЛЬ

  // МЕТОД 1: Обновление коллекции туров
  setItems(items: TourProducts[]): void {
    this.productsList = items;
    this.filteredProducts = null; // Сбрасываем фильтр при обновлении списка
    this.events.emit("products:updated", items);
    this.selectedProduct = null;
  }

  // МЕТОД 2: Получение всех доступных туров (с учётом фильтра)
  getProducts(): TourProducts[] {
    // Если есть фильтр — возвращаем отфильтрованные, иначе — полный список
    return this.filteredProducts !== null
      ? this.filteredProducts
      : this.productsList;
  }

  // МЕТОД 3: Поиск тура по ID
  getProductById(id: string): TourProducts | null {
    const product = this.productsList.find((p) => p.id === id) || null;
    if (product) {
      this.events.emit("product:found", product);
    }
    return product;
  }

  // МЕТОД 4: Установка выбранного тура
  setSelectedProduct(product: TourProducts): void {
    this.selectedProduct = product;
    this.events.emit("product:selected", product);
  }

  // МЕТОД 5: Получение выбранного тура
  getSelectedProduct(): TourProducts | null {
    return this.selectedProduct;
  }

  // НОВЫЙ МЕТОД: Фильтрация туров по категории
  filterByCategory(category: string | null): void {
    // Нормализуем входную категорию
    const normalizedCategory = category?.toLowerCase().trim() || null;

    if (!normalizedCategory || normalizedCategory === "all") {
      this.filteredProducts = null; // Показать все
    } else {
      // Нормализуем категории в данных при фильтрации
      this.filteredProducts = this.productsList.filter((product) => {
        const productCat = product.category?.toLowerCase().trim();
        return productCat === normalizedCategory;
      });
    }

    // Сигнализируем об обновлении списка
    this.events.emit("products:updated", this.getProducts());
  }
}
