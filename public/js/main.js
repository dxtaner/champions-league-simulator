document.addEventListener("DOMContentLoaded", () => {
  const simButtons = document.querySelectorAll("form button");

  simButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const form = button.closest("form");
      if (form) {
        button.disabled = true;
        button.innerText = "Simüle Ediliyor...";
        form.submit();
      }
    });
  });
});
