import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ModalOptions {
  content: HTMLElement;
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  onClose?: () => void;  
}

export class ModalWindow extends Component<HTMLElement> {
  public _isOpen = false;

  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;

  constructor(
    protected events: IEvents,
    closeSelector = ".modal__close",
    contentSelector = ".modal__content"
  ) {
    super(ensureElement<HTMLElement>("#modal-container"));

    this.closeButton = ensureElement<HTMLButtonElement>(
      closeSelector,
      this.container
    );
    this.contentContainer = ensureElement<HTMLElement>(
      contentSelector,
      this.container
    );

    this.closeButton.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("click", (e: MouseEvent) => {
      if (e.target === this.container && this._isOpen) this.close();
    });
    
  }

  open(content: HTMLElement): this {
    this.contentContainer.replaceChildren(content);
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
    this._isOpen = true;
    return this;
  }

  close(): void {
    if (!this._isOpen) return;

    this._isOpen = false;
    this.container.classList.remove("modal_active");
    this.contentContainer.innerHTML = "";
    document.body.style.overflow = "";
  }

  show(options: ModalOptions): void {
    // Дефолтные значения
    const closable = options.closable ?? true;
    const closeOnOverlayClick = options.closeOnOverlayClick ?? true;

    this.open(options.content);

    // Применяем настройки
    this.container.classList.toggle("modal_unclosable", !closable);
    this.container.style.pointerEvents = closeOnOverlayClick ? "auto" : "none";
  }
}
