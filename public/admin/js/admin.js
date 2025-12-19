const API = "/api/products";

/* =====================
   LOAD PRODUCTS
===================== */
async function loadProducts() {
  console.log("loadProducts() called");

  const tbody = document.querySelector("#productsTable tbody");
  if (!tbody) return;

  const res = await fetch(`${API}/all`);
  console.log("API status:", res.status);

  const products = await res.json();
  console.log("Products received:", products);

  tbody.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.category}</td>
      <td>
        <a href="edit-product.html?id=${p._id}">Edit</a> |
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* =====================
   DELETE PRODUCT ✅ FIXED
===================== */
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    loadProducts();
  } else {
    alert("Delete failed");
  }
}

/* =====================
   ADD PRODUCT
===================== */
async function addProduct(e) {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  window.location.href = "products.html";
}

/* =====================
   LOAD EDIT PRODUCT
===================== */
async function loadEditProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const res = await fetch(`${API}/${id}`);
  const p = await res.json();

  document.getElementById("name").value = p.name;
  document.getElementById("price").value = p.price;
  document.getElementById("category").value = p.category;
  document.getElementById("image").value = p.image;
  document.getElementById("description").value = p.description;
}

/* =====================
   UPDATE PRODUCT
===================== */
async function updateProduct(e) {
  e.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id");

  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  window.location.href = "products.html";
}

/* AUTO LOAD */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadEditProduct();
});
