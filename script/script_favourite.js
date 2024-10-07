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



function toggleCatalog() {
    var popup = document.getElementById("catalogPopup");
    popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

function closeCatalog(event) {
    var popup = document.getElementById("catalogPopup");
    popup.style.display = "none"; 
}

function showProducts(category) {
    var productList = document.getElementById("productList");
    var products = '';

    if (category === 'laptops') {
        products = `
            <h3>Ноутбуки та комп'ютери</h3>
            <div class="laptop-list">
                <div class="laptop-column">
                    <li><a href="link_to_laptop1">Ноутбук 1</a></li>
                    <li><a href="link_to_laptop2">Ноутбук 2</a></li>
                    <li><a href="link_to_laptop3">Ноутбук 3</a></li>
                    <li><a href="link_to_laptop4">Ноутбук 4</a></li>
                </div>
                <div class="laptop-column">
                    <li><a href="link_to_laptop5">Ноутбук 5</a></li>
                    <li><a href="link_to_laptop6">Ноутбук 6</a></li>
                    <li><a href="link_to_laptop7">Ноутбук 7</a></li>
                    <li><a href="link_to_laptop8">Ноутбук 8</a></li>
                </div>
                <div class="laptop-column">
                    <li><a href="link_to_laptop1">Ноутбук 1</a></li>
                    <li><a href="link_to_laptop2">Ноутбук 2</a></li>
                    <li><a href="link_to_laptop3">Ноутбук 3</a></li>
                    <li><a href="link_to_laptop4">Ноутбук 4</a></li>
                </div>
            </div>
        `;
    } else if (category === 'smartphones') {
        products = `
            <h3>Смартфони, ТВ і електроніка</h3>
            <div class="smartphone-list">
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone1">Смартфон 1</a></li>
                    <li><a href="link_to_smartphone2">Смартфон 2</a></li>
                    <li><a href="link_to_smartphone3">Смартфон 3</a></li>
                </div>
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone1">Смартфон 1</a></li>
                    <li><a href="link_to_smartphone2">Смартфон 2</a></li>
                    <li><a href="link_to_smartphone3">Смартфон 3</a></li>
                </div>
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone1">Смартфон 1</a></li>
                    <li><a href="link_to_smartphone2">Смартфон 2</a></li>
                    <li><a href="link_to_smartphone3">Смартфон 3</a></li>
                </div>
            </div>
        `;
    } else if (category === 'gaming') {
        products = `
            <h3>Товари для геймерів</h3>
            <div class="gaming-list">
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set1">Геймерський комплект 1</a></li>
                    <li><a href="link_to_gaming_set2">Геймерський комплект 2</a></li>
                    <li><a href="link_to_gaming_set3">Геймерський комплект 3</a></li>
                </div>
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set1">Геймерський комплект 1</a></li>
                    <li><a href="link_to_gaming_set2">Геймерський комплект 2</a></li>
                    <li><a href="link_to_gaming_set3">Геймерський комплект 3</a></li>
                </div>
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set1">Геймерський комплект 1</a></li>
                    <li><a href="link_to_gaming_set2">Геймерський комплект 2</a></li>
                    <li><a href="link_to_gaming_set3">Геймерський комплект 3</a></li>
                </div>
            </div>
        `;
    } else if (category === 'home_appliances') {
        products = `
            <h3>Побутова техніка</h3>
            <div class="appliance-list">
                <div class="appliance-column">
                    <li><a href="link_to_appliance1">Техніка 1</a></li>
                    <li><a href="link_to_appliance2">Техніка 2</a></li>
                    <li><a href="link_to_appliance3">Техніка 3</a></li>
                </div>
                <div class="appliance-column">
                    <li><a href="link_to_appliance4">Техніка 4</a></li>
                    <li><a href="link_to_appliance5">Техніка 5</a></li>
                    <li><a href="link_to_appliance6">Техніка 6</a></li>
                </div>
                <div class="appliance-column">
                    <li><a href="link_to_appliance7">Техніка 7</a></li>
                    <li><a href="link_to_appliance8">Техніка 8</a></li>
                    <li><a href="link_to_appliance9">Техніка 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'home_goods') {
        products = `
            <h3>Товари для дому</h3>
            <div class="home-product-list">
                <div class="home-product-column">
                    <li><a href="link_to_home_product1">Товар для дому 1</a></li>
                    <li><a href="link_to_home_product2">Товар для дому 2</a></li>
                    <li><a href="link_to_home_product3">Товар для дому 3</a></li>
                </div>
                <div class="home-product-column">
                    <li><a href="link_to_home_product4">Товар для дому 4</a></li>
                    <li><a href="link_to_home_product5">Товар для дому 5</a></li>
                    <li><a href="link_to_home_product6">Товар для дому 6</a></li>
                </div>
                <div class="home-product-column">
                    <li><a href="link_to_home_product7">Товар для дому 7</a></li>
                    <li><a href="link_to_home_product8">Товар для дому 8</a></li>
                    <li><a href="link_to_home_product9">Товар для дому 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'tools') {
        products = `
            <h3>Інструменти та автотовари</h3>
            <div class="tool-product-list">
                <div class="tool-product-column">
                    <li><a href="link_to_tool1">Інструмент 1</a></li>
                    <li><a href="link_to_tool2">Інструмент 2</a></li>
                    <li><a href="link_to_tool3">Інструмент 3</a></li>
                </div>
                <div class="tool-product-column">
                    <li><a href="link_to_tool4">Інструмент 4</a></li>
                    <li><a href="link_to_tool5">Інструмент 5</a></li>
                    <li><a href="link_to_tool6">Інструмент 6</a></li>
                </div>
                <div class="tool-product-column">
                    <li><a href="link_to_tool7">Інструмент 7</a></li>
                    <li><a href="link_to_tool8">Інструмент 8</a></li>
                    <li><a href="link_to_tool9">Інструмент 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'plumbing') {
        products = `
            <h3>Сантехніка та ремонт</h3>
            <div class="plumbing-product-list">
                <div class="plumbing-product-column">
                    <li><a href="link_to_plumbing1">Сантехніка 1</a></li>
                    <li><a href="link_to_plumbing2">Сантехніка 2</a></li>
                    <li><a href="link_to_plumbing3">Сантехніка 3</a></li>
                </div>
                <div class="plumbing-product-column">
                    <li><a href="link_to_plumbing4">Сантехніка 4</a></li>
                    <li><a href="link_to_plumbing5">Сантехніка 5</a></li>
                    <li><a href="link_to_plumbing6">Сантехніка 6</a></li>
                </div>
                <div class="plumbing-product-column">
                    <li><a href="link_to_plumbing7">Сантехніка 7</a></li>
                    <li><a href="link_to_plumbing8">Сантехніка 8</a></li>
                    <li><a href="link_to_plumbing9">Сантехніка 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'garden') {
        products = `
            <h3>Дача, сад і город</h3>
            <div class="garden-product-list">
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product1">Товар для саду 1</a></li>
                    <li><a href="link_to_garden_product2">Товар для саду 2</a></li>
                    <li><a href="link_to_garden_product3">Товар для саду 3</a></li>
                </div>
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product4">Товар для саду 4</a></li>
                    <li><a href="link_to_garden_product5">Товар для саду 5</a></li>
                    <li><a href="link_to_garden_product6">Товар для саду 6</a></li>
                </div>
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product7">Товар для саду 7</a></li>
                    <li><a href="link_to_garden_product8">Товар для саду 8</a></li>
                    <li><a href="link_to_garden_product9">Товар для саду 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'sports') {
        products = `
            <h3>Спорт і захоплення</h3>
            <div class="sport-product-list">
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product1">Спортивний товар 1</a></li>
                    <li><a href="link_to_sport_product2">Спортивний товар 2</a></li>
                    <li><a href="link_to_sport_product3">Спортивний товар 3</a></li>
                </div>
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product4">Спортивний товар 4</a></li>
                    <li><a href="link_to_sport_product5">Спортивний товар 5</a></li>
                    <li><a href="link_to_sport_product6">Спортивний товар 6</a></li>
                </div>
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product7">Спортивний товар 7</a></li>
                    <li><a href="link_to_sport_product8">Спортивний товар 8</a></li>
                    <li><a href="link_to_sport_product9">Спортивний товар 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'clothing') {
        products = `
            <h3>Одяг, взуття та прикраси</h3>
            <div class="clothing-list">
                <div class="clothing-column">
                    <li><a href="link_to_clothing1">Одяг 1</a></li>
                    <li><a href="link_to_clothing2">Одяг 2</a></li>
                    <li><a href="link_to_clothing3">Одяг 3</a></li>
                </div>
                <div class="clothing-column">
                    <li><a href="link_to_clothing4">Одяг 4</a></li>
                    <li><a href="link_to_clothing5">Одяг 5</a></li>
                    <li><a href="link_to_clothing6">Одяг 6</a></li>
                </div>
                <div class="clothing-column">
                    <li><a href="link_to_clothing7">Одяг 7</a></li>
                    <li><a href="link_to_clothing8">Одяг 8</a></li>
                    <li><a href="link_to_clothing9">Одяг 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'beauty') {
        products = `
            <h3>Краса та здоров'я</h3>
            <div class="beauty-list">
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product1">Продукт для краси 1</a></li>
                    <li><a href="link_to_beauty_product2">Продукт для краси 2</a></li>
                    <li><a href="link_to_beauty_product3">Продукт для краси 3</a></li>
                </div>
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product4">Продукт для краси 4</a></li>
                    <li><a href="link_to_beauty_product5">Продукт для краси 5</a></li>
                    <li><a href="link_to_beauty_product6">Продукт для краси 6</a></li>
                </div>
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product7">Продукт для краси 7</a></li>
                    <li><a href="link_to_beauty_product8">Продукт для краси 8</a></li>
                    <li><a href="link_to_beauty_product9">Продукт для краси 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'kids') {
        products = `
            <h3>Дитячі товари</h3>
            <div class="kids-list">
                <div class="kids-column">
                    <li><a href="link_to_kids_product1">Товар для дітей 1</a></li>
                    <li><a href="link_to_kids_product2">Товар для дітей 2</a></li>
                    <li><a href="link_to_kids_product3">Товар для дітей 3</a></li>
                </div>
                <div class="kids-column">
                    <li><a href="link_to_kids_product4">Товар для дітей 4</a></li>
                    <li><a href="link_to_kids_product5">Товар для дітей 5</a></li>
                    <li><a href="link_to_kids_product6">Товар для дітей 6</a></li>
                </div>
                <div class="kids-column">
                    <li><a href="link_to_kids_product7">Товар для дітей 7</a></li>
                    <li><a href="link_to_kids_product8">Товар для дітей 8</a></li>
                    <li><a href="link_to_kids_product9">Товар для дітей 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'pets') {
        products = `
           <h3>Зоотовари</h3>
            <div class="pet-list">
                <div class="pet-column">
                    <li><a href="link_to_pet_product1">Товар для тварин 1</a></li>
                    <li><a href="link_to_pet_product2">Товар для тварин 2</a></li>
                    <li><a href="link_to_pet_product3">Товар для тварин 3</a></li>
                </div>
                <div class="pet-column">
                    <li><a href="link_to_pet_product4">Товар для тварин 4</a></li>
                    <li><a href="link_to_pet_product5">Товар для тварин 5</a></li>
                    <li><a href="link_to_pet_product6">Товар для тварин 6</a></li>
                </div>
                <div class="pet-column">
                    <li><a href="link_to_pet_product7">Товар для тварин 7</a></li>
                    <li><a href="link_to_pet_product8">Товар для тварин 8</a></li>
                    <li><a href="link_to_pet_product9">Товар для тварин 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'office') {
        products = `
            <h3>Офіс, школа, книги</h3>
            <div class="office-list">
                <div class="office-column">
                    <li><a href="link_to_office_product1">Канцтовар 1</a></li>
                    <li><a href="link_to_office_product2">Канцтовар 2</a></li>
                    <li><a href="link_to_office_product3">Канцтовар 3</a></li>
                </div>
                <div class="office-column">
                    <li><a href="link_to_office_product4">Канцтовар 4</a></li>
                    <li><a href="link_to_office_product5">Канцтовар 5</a></li>
                    <li><a href="link_to_office_product6">Канцтовар 6</a></li>
                </div>
                <div class="office-column">
                    <li><a href="link_to_office_product7">Канцтовар 7</a></li>
                    <li><a href="link_to_office_product8">Канцтовар 8</a></li>
                    <li><a href="link_to_office_product9">Канцтовар 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'alcohol') {
        products = `
            <h3>Алкогольні напої та продукти</h3>
            <div class="alcohol-list">
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol1">Напій 1</a></li>
                    <li><a href="link_to_alcohol2">Напій 2</a></li>
                    <li><a href="link_to_alcohol3">Напій 3</a></li>
                </div>
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol4">Напій 4</a></li>
                    <li><a href="link_to_alcohol5">Напій 5</a></li>
                    <li><a href="link_to_alcohol6">Напій 6</a></li>
                </div>
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol7">Напій 7</a></li>
                    <li><a href="link_to_alcohol8">Напій 8</a></li>
                    <li><a href="link_to_alcohol9">Напій 9</a></li>
                </div>
            </div>
        `;
    } else if (category === 'cleaning') {
        products = `
            <h3>Побутова хімія</h3>
            <div class="cleaning-list">
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning1">Хімія 1</a></li>
                    <li><a href="link_to_cleaning2">Хімія 2</a></li>
                    <li><a href="link_to_cleaning3">Хімія 3</a></li>
                </div>
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning4">Хімія 4</a></li>
                    <li><a href="link_to_cleaning5">Хімія 5</a></li>
                    <li><a href="link_to_cleaning6">Хімія 6</a></li>
                </div>
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning7">Хімія 7</a></li>
                    <li><a href="link_to_cleaning8">Хімія 8</a></li>
                    <li><a href="link_to_cleaning9">Хімія 9</a></li>
                </div>
            </div>
        `;
    }
    
        

    productList.innerHTML = products; 
}

