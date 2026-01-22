import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export type OrderResult = {
  id: string;
  total: number;
};

export class Success extends Component<OrderResult> {
  protected orderTitleElement: HTMLElement;
  protected description: HTMLElement;
  protected orderButtonCloseElement: HTMLButtonElement;
  protected orderSuccessImages: HTMLElement;

  constructor(protected events: EventEmitter, container: HTMLElement) {
    super(container);

    this.orderTitleElement = ensureElement<HTMLElement>(
      ".order-success__title",
      this.container
    );

    this.orderSuccessImages = ensureElement<HTMLElement>(
      ".order-success__images",
      this.container
    );

    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.orderButtonCloseElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.orderButtonCloseElement.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  // Возвращаем корневой элемент компонента
  getContainer(): HTMLElement {
    return this.container;
  }
}
