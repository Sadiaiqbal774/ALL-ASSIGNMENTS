const API_URL = "http://localhost:3000/api/products";

// Fetch all products and display in a table or div
async function loadProducts() {
  const res = await fetch(`${API_URL}/all`);
  const data = await res.json();

  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  data.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
      <p>${product.description}</p>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

// Delete product
async function deleteProduct(id) {
  await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
  loadProducts();
}

// Call loadProducts on page load
window.onload = loadProducts;
