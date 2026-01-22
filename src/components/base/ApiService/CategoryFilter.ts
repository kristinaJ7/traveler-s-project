
import { Products } from '../../Models/productTour';

export class CategoryFilter {
  private productsModel: Products;
  private categoryLinks: NodeListOf<HTMLAnchorElement>;

  constructor(productsModel: Products, containerSelector: string) {
    this.productsModel = productsModel;
    this.categoryLinks = document.querySelectorAll(`${containerSelector} .destinations_item a`);
    this.init();
  }

  private init() {
    // 1. Подписка на клики
    this.categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = this.getCategoryFromLink(link);
        if (!category) return;

        // 2. Сохраняем в localStorage
        localStorage.setItem('selectedCategory', category);

        // 3. Фильтруем данные
        this.productsModel.filterByCategory(category);


        // 4. Обновляем UI
        this.setActiveCategory(category);
      });
    });

    // 5. Восстановление состояния после загрузки данных
    this.productsModel.events.on('products:loaded', () => {
      const savedCategory = localStorage.getItem('selectedCategory') || 'All';
      this.setActiveCategory(savedCategory);
      this.productsModel.filterByCategory(savedCategory);
    });
  }

  // Получаем категорию из ссылки (нормализация)
  private getCategoryFromLink(link: HTMLAnchorElement): string | null {
    const text = link.textContent?.trim();
    return text ? text : null;
  }

  // Устанавливаем активный пункт
 private setActiveCategory(category: string) {
    this.categoryLinks.forEach(link => {
      const parent = link.parentElement;
      if (!parent) return;

      const linkCategory = this.getCategoryFromLink(link);
      if (!linkCategory) return;

      // Нормализация для сравнения
      const normalizedLinkCat = linkCategory.toLowerCase();
      const normalizedCategory = category.toLowerCase();


      parent.classList.toggle('active', normalizedLinkCat === normalizedCategory);
    });
  }

  public setCategory(category: string) {
    localStorage.setItem('selectedCategory', category);
    this.productsModel.filterByCategory(category);
    this.setActiveCategory(category);
  }
}
