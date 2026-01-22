//анимация плавного появления блоков
export function initFadeInAnimation() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1, // 10% видимости элемента
    }
  );

  fadeElements.forEach((el) => observer.observe(el));
}
