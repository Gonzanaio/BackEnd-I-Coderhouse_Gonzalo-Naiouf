document.addEventListener("DOMContentLoaded", async () => {
  let cartId = localStorage.getItem("cartId");
  const cartLink = document.getElementById("cart-link");

  if (!cartId) {
    const res = await fetch("/api/carts", { method: "POST" });
    const data = await res.json();
    cartId = data.payload._id;
    localStorage.setItem("cartId", cartId);
  }

  if (cartLink) {
    cartLink.href = `/api/carts/${cartId}/`;
  }

  const minusBtns = document.querySelectorAll(".qty-minus");
  const plusBtns = document.querySelectorAll(".qty-plus");

  minusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      input.value = Math.max(1, parseInt(input.value) - 1);
    });
  });

  plusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      input.value = parseInt(input.value) + 1;
    });
  });

  const addBtns = document.querySelectorAll(".btn-add");

  addBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      const input = document.querySelector(
        `.qty-input[data-id="${productId}"]`
      );
      const quantity = parseInt(input?.value) || 1;

      try {
        const response = await fetch(
          `/api/carts/${cartId}/products/${productId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("ERROR API:", text);
          throw new Error("Falló el endpoint");
        }

        Swal.fire({
          title: "¡Listo!",
          text: "Producto agregado al carrito",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (e) {
        alert("Error al agregar");
      }
    });
  });
});
