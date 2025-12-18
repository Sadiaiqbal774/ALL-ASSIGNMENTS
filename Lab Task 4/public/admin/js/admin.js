// public/admin/js/admin.js

const API = "/api/products";

/* =====================
   LOAD PRODUCTS (ADMIN)
===================== */
async function loadProducts() {
  const tbody = document.querySelector("#productsTable tbody");
  if (!tbody) return;

  const res = await fetch(`${API}/all`);
  const products = await res.json();

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
   DELETE PRODUCT
===================== */
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  await fetch(`${API}/delete/${id}`, {
    method: "DELETE"
  });

  loadProducts(); // refresh list
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

  await fetch(`${API}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  alert("Product added successfully");
  window.location.href = "products.html";
}

/* =====================
   EDIT PRODUCT
===================== */
async function loadEditProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await fetch(`${API}/${id}`);
  const p = await res.json();

  document.getElementById("name").value = p.name;
  document.getElementById("price").value = p.price;
  document.getElementById("category").value = p.category;
  document.getElementById("image").value = p.image;
  document.getElementById("description").value = p.description;
}

async function updateProduct(e) {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  await fetch(`${API}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  alert("Product updated");
  window.location.href = "products.html";
}

/* AUTO LOAD */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadEditProduct();
});
