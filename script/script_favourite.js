document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');

    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

    function displayFavoriteProducts() {
        favoritesContainer.innerHTML = '';

        if (favoriteProducts.length === 0) {
            favoritesContainer.innerHTML = '<p>У вас немає улюблених товарів.</p>';
            return;
        }

        favoriteProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} грн</div>
                <button class="buy-button" onclick="removeFromFavorites('${product.name}')">Видалити</button>
            `;
            favoritesContainer.appendChild(productCard);
        });
    }

    window.removeFromFavorites = (productName) => {
        const updatedFavorites = favoriteProducts.filter(product => product.name !== productName);
        
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));

        favoriteProducts.length = 0; 
        Array.prototype.push.apply(favoriteProducts, updatedFavorites); 

        displayFavoriteProducts();
        updateCounts();
    };

    displayFavoriteProducts();

    updateCounts();
});

function updateCounts() {
    const favoriteCountElement = document.getElementById('favorite-count');
    const compareCountElement = document.getElementById('compare-count');
    const cartCountElement = document.getElementById('cart-count');

    const favoriteCount = JSON.parse(localStorage.getItem('favoriteProducts')).length || 0;
    const compareCount = JSON.parse(localStorage.getItem('compareProducts')).length || 0; 
    const cartCount = JSON.parse(localStorage.getItem('cartProducts')).length || 0; 

    favoriteCountElement.style.display = favoriteCount > 0 ? 'block' : 'none';
    favoriteCountElement.textContent = favoriteCount;

    compareCountElement.style.display = compareCount > 0 ? 'block' : 'none';
    compareCountElement.textContent = compareCount;

    cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    cartCountElement.textContent = cartCount;
}
