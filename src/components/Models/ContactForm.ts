import { EventEmitter } from "../base/Events";

export class ContactForm {
  // Свойства класса
  private form: HTMLFormElement;
  private events: EventEmitter;

  // Конструктор класса
  constructor(form: HTMLFormElement, events: EventEmitter) {
    this.form = form;
    this.events = events;
    this.initValidation();
  }

  // Приватные методы
  private initValidation() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = this.validate();

      if (errors.length === 0) {
        // Ошибок нет → отправляем данные и сбрасываем форму
        this.events.emit("form:valid", this.getValues());
        this.reset();
      } else {
        // Есть ошибки → показываем их и НЕ сбрасываем форму
        this.showErrors(errors);
      }
    });
  }

  private validate(): string[] {
    const name = this.form.querySelector("#name") as HTMLInputElement;
    const phone = this.form.querySelector("#phone") as HTMLInputElement;
    const email = this.form.querySelector("#email") as HTMLInputElement;

    this.clearErrors(); // Очищаем предыдущие ошибки
    const errors: string[] = [];

    // Проверка полей
    if (name.value.length < 4) {
      errors.push(
        "Имя слишком короткое, пожалуйста проверьте  заполненние данных"
      );
    }
    if (!this.isValidPhone(phone.value)) {
      errors.push(
        "Неверный формат телефона, пожалуйста проверьте заполненние данных"
      );
    }
    if (!this.isValidEmail(email.value)) {
      errors.push("Неверный email, пожалуйста проверьте заполненние данных");
    }

    return errors;
  }

  private clearErrors() {
    const errorList = this.form.querySelector(".error-list");
    if (errorList) errorList.remove();
  }

  private isValidPhone(value: string): boolean {
    return /^\+?[0-9\s\-\(\)]{7,}$/.test(value);
  }

  private isValidEmail(value: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  private showErrors(errors: string[]) {
    this.clearErrors(); // Гарантированно удаляем старый список
    const errorList =
      this.form.querySelector(".error-list") || document.createElement("ul");
    errorList.className = "error-list";

    errors.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });

    this.form.appendChild(errorList);
  }

  private getValues() {
    // Обязательные поля
    const nameInput = this.form.querySelector("#name") as HTMLInputElement;
    const phoneInput = this.form.querySelector("#phone") as HTMLInputElement;
    const emailInput = this.form.querySelector("#email") as HTMLInputElement;

    // Опциональное поле — допускаем отсутствие в DOM
    const messageInput = this.form.querySelector(
      'textarea[name="message"]'
    ) as HTMLTextAreaElement | null;

    return {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput?.value?.trim() ?? "", // Если нет → пустая строка
    };
  }

  private reset() {
    // Очищаем поля
    this.form.reset();

    // Удаляем ошибки (только если форма успешно отправлена)
    this.clearErrors();

    // 3. Дополнительно: можно снять фокусы или стили (если нужно)
    // Например, убрать классы `.error` у полей:
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.classList.remove("error");
    });
  }

  public resetForm() {
    // Публичный метод: просто запускает сброс
    this.reset();
  }
}
