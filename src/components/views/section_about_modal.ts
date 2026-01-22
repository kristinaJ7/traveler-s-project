import { ensureElement } from "../../utils/utils";

export class SectionAboutModal {
  private container: HTMLElement;
  private titleElement: HTMLElement;
  private textElement: HTMLElement;
  private imagesContainer: HTMLElement;
  private linkElement: HTMLAnchorElement;
  private videoElement: HTMLVideoElement;

  constructor(container: HTMLElement) {
    this.container = container;

    // Обязательные элементы (должны быть в шаблоне)
    this.titleElement = ensureElement(".about_modal_title", this.container);
    this.textElement = ensureElement(".about_modal_text", this.container);
    this.imagesContainer = ensureElement(".about_modal_images", this.container);

    this.linkElement = ensureElement(
      ".link_about_modal",
      this.container
    ) as HTMLAnchorElement;

    // Опциональный элемент (оставляем заглушку)
    try {
      this.videoElement = ensureElement(
        "video",
        this.container
      ) as HTMLVideoElement;
    } catch {
      console.warn("Элемент <video> не найден в шаблоне. Создаём заглушку.");
      this.videoElement = document.createElement("video");
    }
  }

  set title(value: string | null | undefined) {
    this.titleElement.textContent = value || "";
  }

  set text(value: string | null | undefined) {
    this.textElement.textContent = value || "";
  }

  set images(urls: string[]) {
    this.imagesContainer.innerHTML = urls
      .map((src) => `<img src="${src}" alt="Travel image" class="modal-image">`)
      .join("");
  }

  set link(url: string) {
    if (!url) {
      throw new Error("URL для ссылки не может быть пустым");
    }
    this.linkElement.href = url;
    this.linkElement.textContent = "Download Catalog";
  }

  set video(url: string) {
    this.videoElement.src = url;
    this.videoElement.controls = true;
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}
