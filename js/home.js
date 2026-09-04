const modalTriggers = document.querySelectorAll("[data-open-contact-modal]");

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (typeof window.sendTG === "function") {
      window.sendTG();
    }
  });
});

const quickEstimateForm = document.getElementById("quick-estimate-form");
const quickEstimateStatus = document.getElementById("quick-estimate-status");

if (quickEstimateForm && quickEstimateStatus) {
  const submitButton = quickEstimateForm.querySelector('button[type="submit"]');

  const setEstimateStatus = (message, state = "info") => {
    quickEstimateStatus.textContent = message;
    quickEstimateStatus.dataset.state = state;
  };

  quickEstimateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quickEstimateForm.reportValidity()) {
      return;
    }

    const data = new FormData(quickEstimateForm);
    const projectType = String(data.get("projectType") || "").trim();
    const area = String(data.get("area") || "").trim();
    const city = String(data.get("city") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();

    const payload = {
      name: "Заявка с быстрого расчёта",
      email,
      phone,
      message: `Быстрый расчёт\nТип объекта: ${projectType}\nПлощадь: ${area} м²\nГород: ${city}`,
      company: String(data.get("company") || "").trim()
    };

    try {
      if (submitButton) submitButton.disabled = true;
      setEstimateStatus("Отправляем заявку...", "loading");

      const response = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Не удалось отправить заявку.");
      }

      quickEstimateForm.reset();
      setEstimateStatus("Заявка отправлена. Свяжемся с вами в рабочее время.", "success");
    } catch (error) {
      setEstimateStatus(error.message || "Ошибка отправки. Попробуйте ещё раз.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
