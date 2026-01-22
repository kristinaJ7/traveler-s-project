import { ensureElement } from "../../../utils/utils";
import { CATEGORY_MAP } from "../../../utils/constants";
import { SUPABASE_STORAGE_URL } from "../../../utils/constants";
import { TourProducts } from "../../../types";

export class PreviewCard {
  protected container: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected textElement: HTMLElement;
  protected priceElement: HTMLElement;

  protected buttonElement: HTMLButtonElement;
  private product: TourProducts | null = null;

  //свойства класса (поля формы)
  protected nameInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected nameError: HTMLElement;
  protected emailError: HTMLElement;
  protected phoneError: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

 
    console.log(
      "modal__actions exists:",
      this.container.querySelector(".modal__actions")
    );
    console.log(
      "card__price exists:",
      this.container.querySelector(".card__price")
    );

    // Валидация DOM-элементов
    try {
      this.imageElement = ensureElement<HTMLImageElement>(
        ".card__image",
        this.container
      );

      this.categoryElement = ensureElement<HTMLElement>(
        ".card__category",
        this.container
      );
      this.titleElement = ensureElement<HTMLElement>(
        ".card__title_preview",
        this.container
      );
      this.textElement = ensureElement<HTMLElement>(
        ".card__text",
        this.container
      );

      this.buttonElement = ensureElement<HTMLButtonElement>(
        ".send .card__button",
        this.container
      );

      // === ПОЛЯ ФОРМЫ  ===
      this.nameInput = ensureElement<HTMLInputElement>(
        '.form_send [name="name"]',
        this.container
      );
      this.emailInput = ensureElement<HTMLInputElement>(
        '.form_send [name="email"]',
        this.container
      );
      this.phoneInput = ensureElement<HTMLInputElement>(
        '.form_send [name="phone"]',
        this.container
      );
      this.nameError = ensureElement<HTMLElement>("#nameError", this.container);
      this.emailError = ensureElement<HTMLElement>(
        "#emailError",
        this.container
      );
      this.phoneError = ensureElement<HTMLElement>(
        "#phoneError",
        this.container
      );

      this.priceElement = ensureElement<HTMLElement>( 
        ".card__button .card__price",
        this.container
      );
    } catch (error) {
      //ВЫВОД ОШИБКИ ЕСЛИ ЕСТЬ
      console.error("Ошибка инициализации CardPreview:", error);
      throw error;
    }
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  fillData(product: TourProducts): void {
    this.product = product;
    console.log("fillData: product.image_url =", product.image_url);

    this.category = product.category;
    this.title = product.title;
    this.text = product.description || "";
    this.image = product.image_url;
    this.price = product.price;

    this.updateButtonState();
  }

  private updateButtonState(): void {
    if (!this.buttonElement) {
      console.warn("Кнопка .card__button не найдена в DOM");
      return;
    }

    const submitSpan = this.buttonElement.querySelector("span:first-child");
    if (submitSpan) {
      submitSpan.textContent = "Submit a request";
    }

    this.buttonElement.disabled = false;
  }

  // Сеттеры методы которые не хранят данные а лишь присваисвают и отображают их
  set category(value: string) {
    //СЕТТЕР КАТЕГОРИИ
    this.categoryElement.textContent = value;
    Object.keys(CATEGORY_MAP).forEach((key) => {
      this.categoryElement.classList.toggle(
        CATEGORY_MAP[key as keyof typeof CATEGORY_MAP],
        key === value
      );
    });
  }

  set title(value: string) {
    //СЕТТЕР НАЗВАНИЯ ТОВАРА
    this.titleElement.textContent = value || "Нет названия";
  }

  set text(value: string) {
    //СЕТТЕР ОПИСАНИЕ
    this.textElement.textContent = value || "";
  }

  set image(value: string | null | undefined) {
    //СЕТТЕР ФОТО
    if (!value?.trim()) {
      this.imageElement.src = this.imageElement.alt = "";
      return;
    }

    const url = value.trim();
    const isAbs = url.startsWith("http://") || url.startsWith("https://");
    const src = isAbs ? url : `${SUPABASE_STORAGE_URL}/${url}`;

    this.imageElement.onerror = () =>
      (this.imageElement as any).fb &&
      this.loadImage((this.imageElement as any).fb);
    this.loadImage(src, isAbs ? undefined : `${src}.png`);
  }

  private loadImage(src: string, fb?: string) {
    this.imageElement.src = src;
    this.imageElement.alt = this.product?.title || "Изображение товара";
    (this.imageElement as any).fb = fb;
  }

  set price(value: number | null) {
    //СЕТТЕР ДЛЯ ЦЕН
    if (!this.priceElement) {
      console.warn("Элемент .card__price не найден в DOM");
      return;
    }

    if (value === null) {
      this.priceElement.textContent =
        "Цена временно отсутствует. Пожалуйста, позвоните нам для уточнения.";
    } else {
      this.priceElement.textContent = `$${value.toFixed(2)}`;
    }
  }

  // Публичный сеттер для установки обработчика клика на кнопку
  set onSubmit(handler: () => void) {
    if (!this.buttonElement) {
      console.warn(
        "Кнопка .card__button не найдена, нельзя назначить обработчик"
      );
      return;
    }

    // Удаляем предыдущий обработчик (если был), чтобы не накапливать слушатели
    this.buttonElement.replaceWith(this.buttonElement.cloneNode(true));
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    // Навешиваем новый обработчик
    this.buttonElement.addEventListener("click", handler);
  }
}
