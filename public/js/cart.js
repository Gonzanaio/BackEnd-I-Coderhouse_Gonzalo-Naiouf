document.addEventListener("DOMContentLoaded", () => {
  const cartId = localStorage.getItem("cartId");

  const updateTotals = () => {
    let total = 0;
    document.querySelectorAll(".cart-item").forEach((item) => {
      const unitPrice = parseFloat(
        item.querySelector(".unit-price").textContent
      );
      const qty = parseInt(item.querySelector(".qty-input").value);
      const subtotalEl = item.querySelector(".subtotal");
      const subtotal = unitPrice * qty;
      subtotalEl.textContent = subtotal.toFixed(2);
      total += subtotal;
    });
    document.getElementById("cart-total").textContent = total.toFixed(2);
  };

  document.getElementById("btn-delete").addEventListener("click", async () => {
    try {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falló el endpoint");

      Swal.fire({
        title: "¡Listo!",
        text: "Carrito vaciado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => location.reload());
    } catch (e) {
      alert("Error al vaciar el carrito");
    }
  });

  const updateQuantity = async (pid, quantity) => {
    await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  };

  document.querySelectorAll(".btn-plus").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${pid}"]`);
      if (!input) return;
      const newQty = parseInt(input.value) + 1;
      await updateQuantity(pid, newQty);
      input.value = newQty;
      updateTotals();
    });
  });

  document.querySelectorAll(".btn-minus").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${pid}"]`);
      if (!input) return;
      const newQty = Math.max(1, parseInt(input.value) - 1);
      await updateQuantity(pid, newQty);
      input.value = newQty;
      updateTotals();
    });
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.dataset.id;
      await fetch(`/api/carts/${cartId}/products/${pid}`, { method: "DELETE" });
      Swal.fire({
        title: "¡Listo!",
        text: "Producto eliminado",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => location.reload());
    });
  });
  const checkoutBtn = document.getElementById("btn-checkout");

  checkoutBtn.addEventListener("click", async () => {
    const cartId = localStorage.getItem("cartId");
    try {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falló el endpoint");

      Swal.fire({
        title: "¡Listo!",
        text: "Compra Exitosa",
        icon: "success",
        timer: 1500,
        showConfirmButton: true,
      }).then(() => location.reload());
    } catch (error) {
      alert("Error al procesar la compra");
    }
  });

  updateTotals();
});
