import { ensureElement } from "../../../utils/utils";
import { TourProducts } from "../../../types";
import { CATEGORY_MAP } from "../../../utils/constants";

export interface ICardActions {
  onClick?: (event: MouseEvent, product: TourProducts) => void;
}

export class CardCatalog {
  protected container: HTMLElement;
  private productData: TourProducts;

  private categoryElement: HTMLElement;
  private titleElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;

  private priceElement: HTMLElement;

  constructor(
    product: TourProducts,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    if (!container) throw new Error("CardCatalog: container не передан");
    if (!product) throw new Error("CardCatalog: product не передан");

    this.container = container;
    this.productData = product;

    this.categoryElement = ensureElement(".card__category", this.container);
    this.titleElement = ensureElement(".card__title", this.container);
    this.imageElement = ensureElement(
      "img.card__image",
      this.container
    ) as HTMLImageElement;
    this.descriptionElement = ensureElement(
      ".card__description",
      this.container
    );

    this.priceElement = ensureElement(".card__price", this.container);

    // Сохраняем обработчик для гарантии типа
    const onClickHandler = actions?.onClick;

    if (onClickHandler) {
      this.container.addEventListener("click", (e) => {
        onClickHandler(e, this.productData);
      });
    }
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  set category(value: string | null | undefined) {
    // Удаляем пробелы и проверяем на пустоту
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
      this.categoryElement.textContent = ""; // Очищаем текст
      // Удаляем все классы категорий
      Object.values(CATEGORY_MAP).forEach((cls) =>
        this.categoryElement.classList.remove(cls)
      );
      return;
    }

    // Устанавливаем очищенное значение
    this.categoryElement.textContent = trimmedValue;

    // Применяем классы для соответствующей категории
    Object.keys(CATEGORY_MAP).forEach((key) =>
      this.categoryElement.classList.toggle(
        CATEGORY_MAP[key as keyof typeof CATEGORY_MAP],
        key === trimmedValue // Сравнение без пробелов
      )
    );
  }

  set title(value: string | null | undefined) {
    this.titleElement.textContent = value || "";
  }

  set image(value: string | null | undefined) {
    // Используем image_url из productData, если value не передано
    const imageUrl = value ?? this.productData.image_url;

    if (!imageUrl || !imageUrl.trim()) {
      this.imageElement.src = "/img/placeholder.png";
      this.imageElement.alt = "Изображение недоступно";
      return;
    }

    this.imageElement.src = imageUrl;
    this.imageElement.alt =
      this.titleElement.textContent || "Изображение товара";

    this.imageElement.onerror = () => {
      console.warn(
        `Изображение не загружено: ${imageUrl}. Используем заглушку.`
      );
      this.imageElement.src = "/img/placeholder.png";
      this.imageElement.alt = "Изображение недоступно";
    };
  }

  set description(value: string | null | undefined) {
    this.descriptionElement.textContent = value || "";
  }

  set price(value: number) {
    const formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.priceElement.textContent = `$${formatted}`;
  }
}
