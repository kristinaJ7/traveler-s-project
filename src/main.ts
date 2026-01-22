// файл точки входа приложения
// Отвечает за: инициализацию компонентов, подписку на события, загрузку данных, базовую координацию между модулями
import "./scss/main.scss";
import { TourProducts } from "./types";
import { SUPABASE_URL, SUPABASE_KEY } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
// Галерея карточек и превью
import { CardCatalog } from "./components/views/card/CardCatalog";
import { ViewGallery } from "./components/views/card/Gallery";
import { PreviewCard } from "./components/views/card/CardPreview";
// Продукты тура
import { Products } from "./components/Models/productTour";
import { EventEmitter } from "./components/base/Events";
// Модалка
import { ModalWindow } from "./components/views/Modal";
// Успех
import { Success } from "./components/views/Success";
// Форма контактов
import { ContactForm } from "./components/Models/ContactForm";
import { SectionAboutModal } from "./components/views/section_about_modal";
// Импорт сервиса API
import { TourService } from "./components/base/ApiService/Server.Api";
//Анимация
import { initFadeInAnimation } from "./utils/fadeInObserver";
//Фильтр по категориям
import { CategoryFilter } from "./components/base/ApiService/CategoryFilter";
// === ИНИЦИАЛИЗАЦИЯ API-СЕРВИСА ===
const tourServiceDependencies = {
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
};
const tourService = new TourService(tourServiceDependencies);
// === ИНИЦИАЛИЗАЦИЯ ===
const events = new EventEmitter();
const productsModel = new Products(events);
const modal = new ModalWindow(events);
// Инициализируем фильтр категорий
const categoryFilter = new CategoryFilter(productsModel, ".destinations_list");
// Получаем шаблоны
const previewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
// Функция создания карточек каталога
function createProductCards(
  products: TourProducts[],
  onClick: (product: TourProducts) => void,
  template: HTMLTemplateElement
): HTMLElement[] {
  return products.map((product) => {
    const cardElement = document.importNode(template.content, true)
      .firstElementChild as HTMLElement;
    const card = new CardCatalog(product, cardElement, {
      onClick: () => onClick(product),
    });
    card.title = product.title;
    card.image = product.image;
    card.category = product.category;
    card.price = product.price;
    card.description = product.description;
    card.getContainer().dataset.id = product.id;
    return card.getContainer();
  });
}
// === КОНТЕЙНЕРЫ ===
const gallery = ensureElement<HTMLElement>(".gallery");
const contactFormElement = ensureElement<HTMLFormElement>(
  ".section_community form"
);
// === ИНИЦИАЛИЗАЦИЯ ОСНОВНОЙ ФОРМЫ (в разделе контактов) ===
const contactForm = new ContactForm(contactFormElement, events);
const galleryView = new ViewGallery(gallery);

// === СОЗДАНИЕ МОДАЛКИ УСПЕХА ===
const successContainer = cloneTemplate(successTemplate);
successContainer.className = "success-container";
const successView = new Success(events, successContainer);
// === ПОДПИСКА: обновление списка туров ===
events.on("products:updated", () => {
  const products = productsModel.getProducts();
  if (products.length === 0) {
    gallery.textContent = "Туров не найдено.";
    return;
  }
  const productCards = createProductCards(
    products,
    (product) => productsModel.setSelectedProduct(product),
    cardTemplate
  );
  galleryView.render(productCards);
});
// === ПОДПИСКА: открытие превью карточки ===
events.on("product:selected", (selectedProduct: TourProducts) => {
  if (!selectedProduct) return;

  const previewContainer = cloneTemplate(previewTemplate);
  previewContainer.className = "preview-container";

  const previewFormElement = previewContainer.querySelector(
    ".form_send"
  ) as HTMLFormElement;
  if (!previewFormElement) {
    console.error("Форма в превью не найдена!");
    return;
  }
  // Инициализируем валидацию для формы в превью
  const previewForm = new ContactForm(previewFormElement, events);
  // Заполняем данные превью
  const preview = new PreviewCard(previewContainer);
  preview.fillData(selectedProduct);
  // Сохраняем экземпляр формы для дальнейшего использования
  (window as any).currentPreviewForm = previewForm;
  // Открываем модалку с превью
  modal.show({
    content: previewContainer,
    closable: true,
    onClose: () => {
      // Сброс формы при закрытии модалки
      (window as any).currentPreviewForm?.resetForm?.();
    },
  });
});
// === ПОДПИСКА: успешная отправка формы (из любого места) ===
events.on("form:valid", async (formData) => {
  try {
    // Используем метод сервиса для отправки данных
    await tourService.insertContact(formData);
    console.log("Данные сохранены в Supabase", formData);

    // Показываем модалку успеха
    modal.show({
      content: successView.getContainer(),
      onClose: () => console.log("Модалка закрыта"),
    });
    // Сброс основной формы
    contactForm.resetForm();
  } catch (error) {
    console.error("Ошибка отправки данных:", error);
    alert("Не удалось отправить данные. Попробуйте ещё раз.");
  }
});
// 7. Обработчик закрытия модалки успеха
events.on("success:close", () => {
  modal.close();
});




// 2. Загружаем туры
tourService
  .fetchTours()
  .then((tours) => {
    //  Сохраняем туры в модель
    productsModel.setItems(tours);
    //  Принудительно устанавливаем категорию «Best Deals»
    const categoryToFilter = "Best Deals";
    //  Применяем фильтрацию и обновляем UI
    categoryFilter.setCategory(categoryToFilter);
  })
  .catch((error) => {
    console.error("Не удалось загрузить туры:", error);
    gallery.textContent = "Не удалось загрузить туры. Проверьте подключение.";
  });

// === ОТКРЫТИЕ МОДАЛКИ «О НАС» ===
const aboutModalTemplate = ensureElement<HTMLTemplateElement>(
  "#section_about_modal"
);
const aboutModalContainer = cloneTemplate(aboutModalTemplate);
const aboutModal = new SectionAboutModal(aboutModalContainer);
const discoverButton = ensureElement<HTMLButtonElement>("#button_type_about");

events.on("about:open", () => {
  modal.show({
    content: aboutModal.getContainer(),
  });
});
discoverButton.addEventListener("click", (e) => {
  e.preventDefault();
  events.emit("about:open");
});
// === РАБОТА С АНИМАЦИЕЙ ===
document.addEventListener("DOMContentLoaded", () => {
  initFadeInAnimation();
});
