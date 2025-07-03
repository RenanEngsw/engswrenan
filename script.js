// ===================================
// FUNÇÃO DE LOGIN (acessível por index.html)
// ===================================
const usuarioValido = "admin";
const senhaValida = "123456";

function login(event) {
    // Impede o formulário de recarregar a página
    event.preventDefault(); 
    
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error-message");

    if (user === usuarioValido && pass === senhaValida) {
        // Redireciona para o dashboard se o login for bem-sucedido
        window.location.href = "dashboard.html"; 
    } else {
        error.textContent = "Usuário ou senha incorretos.";
    }
}


// =================================================================
// LÓGICA DO CATÁLOGO E CARRINHO (só executa no dashboard.html)
// =================================================================

// Espera todo o HTML da página ser carregado antes de executar
document.addEventListener('DOMContentLoaded', function() {
    
    // Esta verificação garante que o código abaixo só rode na página do dashboard,
    // que é a única que tem um elemento com id="catalog".
    if (document.getElementById('catalog')) {
        
        // --- DADOS FICTÍCIOS DOS PRODUTOS ---
        const products = [
            { id: 1, name: 'Notebook Legacy', price: 2599.00, image: 'https://lojamultilaser.vtexassets.com/arquivos/ids/1273333-800-auto?v=638610696622000000&width=800&height=auto&aspect=true' },
            { id: 2, name: 'Smartphone Pro X', price: 1899.90, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4-TCnW4ZuuVJk8a74Y0bW8b68MiWvjnNtTQ&s' },
            { id: 3, name: 'Smartwatch Active', price: 749.50, image: 'https://m.media-amazon.com/images/I/716UYkJVoiL.jpg' },
            { id: 4, name: 'Fone Bluetooth Air', price: 399.00, image: 'https://th.bing.com/th/id/R.80f6a4d21bb5aa25ecaf4f428576c979?rik=Pc0p5QZJL%2b71sg&pid=ImgRaw&r=0' },
            { id: 5, name: 'Tablet Screen+', price: 1250.00, image: 'https://a-static.mlcdn.com.br/800x600/tablet-samsung-galaxy-tab-s6-lite-com-caneta-104-64gb-4gb-ram-android-14-exynos-1280-wi-fi/magazineluiza/238104300/f69e831dbd62f98041c294a85becbeda.jpg' },
            { id: 6, name: 'Câmera DSLR 4K', price: 3200.00, image: 'https://www.loja.canon.com.br/wcsstore/CDBCatalogAssetStore/sku-3071C016-01.jpg' },
        ];

        // --- ESTADO DO CARRINHO ---
        let cart = [];

        // --- ELEMENTOS DO DOM ---
        const catalogContainer = document.getElementById('catalog');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalValue = document.getElementById('cart-total-value');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const finalizeBtn = document.getElementById('finalize-btn');

        // --- FUNÇÕES ---

        function formatCurrency(value) {
            return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        }

        function renderProducts() {
            catalogContainer.innerHTML = ''; // Limpa antes de adicionar, para evitar duplicatas
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${formatCurrency(product.price)}</p>
                        <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                catalogContainer.appendChild(card);
            });
        }

        function updateCartUI() {
            cartItemsContainer.innerHTML = ''; 
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
            } else {
                cart.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">x${item.quantity}</span>
                        <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
                    `;
                    cartItemsContainer.appendChild(li);
                });
            }
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalValue.textContent = formatCurrency(total);
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const cartItem = cart.find(item => item.id === productId);

            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
            }
            updateCartUI();
        }
        
        function clearCart() {
            cart = [];
            updateCartUI();
        }
        
        function finalizePurchase() {
            if(cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Compra finalizada com sucesso! \n\nTotal: ${formatCurrency(totalValue)}`);
            clearCart();
        }

        // --- EVENT LISTENERS ---
        catalogContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(event.target.getAttribute('data-id'));
                addToCart(productId);
            }
        });
        
        clearCartBtn.addEventListener('click', clearCart);
        finalizeBtn.addEventListener('click', finalizePurchase);

        // --- INICIALIZAÇÃO ---
        renderProducts();
        updateCartUI();
    }
});