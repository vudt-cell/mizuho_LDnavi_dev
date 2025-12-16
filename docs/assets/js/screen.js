document.querySelectorAll(".step-carousel").forEach(carouselEl => {
  new bootstrap.Carousel(carouselEl, {
    interval: false,
    ride: false,
    wrap: false
  });

  carouselEl.addEventListener("slid.bs.carousel", e => {
    const modal = carouselEl.closest(".step-modal");
    const indicators = modal.querySelectorAll(".step-indicators button");

    indicators.forEach((dot, i) => {
      dot.classList.toggle("active", i === e.to);
    });

    const slides = carouselEl.querySelectorAll(".carousel-item");
    const lastIndex = slides.length - 1;
    const activeIndex = e.to;

    const nextBtnLabel = modal.querySelector(".btn-next-step span");

    if (nextBtnLabel) {
      nextBtnLabel.textContent = (activeIndex === lastIndex) ? "結果を見る" : "つぎへ";
    }
  });
});

function next(btn) {
  const modal = btn.closest(".step-modal");

  const carouselEl = modal.querySelector(".step-carousel");

  const carousel = bootstrap.Carousel.getInstance(carouselEl);

  const slides = carouselEl.querySelectorAll(".carousel-item");
  const lastIndex = slides.length - 1;

  const activeIndex = [...slides].findIndex(slide =>
    slide.classList.contains("active")
  );

  if (activeIndex === lastIndex) {
    window.location.href = encodeURI('../../資産残高/index.html');
    return;
  }

  carousel.next();
}

function prev(btn) {
  const modal = btn.closest(".step-modal");
  const carouselEl = modal.querySelector(".step-carousel");
  const carousel = bootstrap.Carousel.getInstance(carouselEl);
  carousel.prev();
}

document.querySelectorAll(".step-modal").forEach(modalEl => {
  const dialog = modalEl.querySelector(".modal-dialog");

  modalEl.addEventListener("mousedown", (e) => {
    const clickedBackdrop = !dialog.contains(e.target);

    if (clickedBackdrop) {
      const focused = document.activeElement;
      if (modalEl.contains(focused)) {
        focused.blur();
      }
    }
  });

  modalEl.addEventListener("hide.bs.modal", () => {
    const focused = document.activeElement;
    if (modalEl.contains(focused)) {
      focused.blur();
    }
  });

  // modalEl.addEventListener("hide.bs.modal", () => {
  //   if (modalEl.contains(document.activeElement)) {
  //     document.activeElement.blur();
  //   }
  // });
});
