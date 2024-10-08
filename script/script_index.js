fetch('/database.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const productContainer = document.getElementById('product-container');
        data.categories.forEach(category => {
            category.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                productCard.innerHTML = `
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">₴${product.price.toLocaleString()}</div>
                        </div>
                        <div class="product-card-back">
                            <div class="icon-container">
                                <div class="favorite-icon" onclick="toggleFavorite(this)">
                                    <img src="/pictures/icon4.png" alt="Додати до улюблених" class="favorite-icon-img" data-full="/pictures/iconfull.png">
                                </div>
                                <div class="compare-icon" onclick="addToCompare(this)">
                                    <img src="/pictures/icon3.png" style="width: 24px; height: 24px;" alt="Додати до порівняння" class="compare-icon-img">
                                </div>
                            </div>
                            <h3>Короткі характеристики:</h3>
                            <ul>
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <button class="buy-button" onclick="buyProduct('${product.name}', ${product.price})">Купити</button>
                        </div>
                    </div>
                `;

                productContainer.appendChild(productCard);
            });
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

let adIndex = 0;
const ads = document.querySelectorAll('.ad-image');

function showNextAd() {
    ads[adIndex].style.opacity = 0; 
    adIndex = (adIndex + 1) % ads.length; 
    ads[adIndex].style.opacity = 1; 
}

setInterval(showNextAd, 4000); 




let favoriteCount = localStorage.getItem('favoriteCount') ? parseInt(localStorage.getItem('favoriteCount')) : 0; 
let compareCount = localStorage.getItem('compareCount') ? parseInt(localStorage.getItem('compareCount')) : 0; 
let addedProducts = new Set(JSON.parse(localStorage.getItem('addedProducts')) || []); 

function updateCounts() {
    const favoriteCountElement = document.getElementById('favorite-count');
    const compareCountElement = document.getElementById('compare-count');

    favoriteCountElement.style.display = favoriteCount > 0 ? 'block' : 'none'; 
    favoriteCountElement.textContent = favoriteCount;

    compareCountElement.style.display = compareCount > 0 ? 'block' : 'none';
    compareCountElement.textContent = compareCount;

    localStorage.setItem('favoriteCount', favoriteCount);
    localStorage.setItem('compareCount', compareCount);
}

updateCounts();

function toggleFavorite(element) {
    const icon = element.querySelector('img');  
    const currentSrc = icon.getAttribute('src');
    const fullIconSrc = icon.getAttribute('data-full'); 
    const productCard = element.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productImage = productCard.querySelector('img').src; 
    const productPrice = productCard.querySelector('.product-price').textContent; 

    let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

    if (currentSrc === fullIconSrc) {
        icon.setAttribute('src', '/pictures/icon4.png'); 
        favoriteCount--; 

        favoriteProducts = favoriteProducts.filter(product => product.name !== productName);
        showNotification('Видалено з улюбленого');
    } else {
        icon.setAttribute('src', '/pictures/iconfull.png'); 
        favoriteCount++; 

        favoriteProducts.push({ name: productName, image: productImage, price: productPrice });
        showNotification('Додано до улюбленого');
    }

    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    updateCounts();
}

function addToCompare(element) {
    const icon = element.querySelector('img'); 
    const productName = element.closest('.product-card').querySelector('.product-name').textContent;
    
    if (!addedProducts.has(productName)) {
        addedProducts.add(productName);
        compareCount++; 
        icon.src = "/pictures/icon3Add.png"; 
        showNotification('Додано до порівняння');
    } else {
        addedProducts.delete(productName);
        compareCount--;
        icon.src = "/pictures/icon3.png"; 
        showNotification('Видалено з порівняння');
    }

    localStorage.setItem('addedProducts', JSON.stringify([...addedProducts]));
    updateCounts();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message; 
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); 
}

function displayFavoriteProducts() {
    const favoriteProductsContainer = document.getElementById('favorite-products');
    favoriteProductsContainer.innerHTML = ''; 

    const favoriteProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];

    favoriteProducts.forEach(productName => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-name">${productName}</div>
            <button onclick="removeFromFavorites('${productName}')">Видалити</button>
        `;

        favoriteProductsContainer.appendChild(productCard);
    });
}

function removeFromFavorites(productName) {
    favoriteCount--;
    addedProducts.delete(productName);
    localStorage.setItem('addedProducts', JSON.stringify([...addedProducts]));
    updateCounts();
    displayFavoriteProducts();
}

window.onload = function() {
    displayFavoriteProducts();
    updateCounts();
};






let cartCount = 0; 

function buyProduct(productName, price) {
    cartCount++; 
    updateCartCount(); 
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.innerText = cartCount; 
    cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    showNotification('Товар додано до кошику'); 
    
    updateCartCountInHeader();
}

function updateCartCountInHeader() {
    const headerCartCount = document.getElementById('header-cart-count');
    headerCartCount.textContent = cartCount > 0 ? cartCount : '';
}

function addToCompare(element) {
    const icon = element.querySelector('img'); 
    const productCard = element.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productImage = productCard.querySelector('img').src;
    const productFeatures = Array.from(productCard.querySelectorAll('ul li')).map(li => li.textContent);

    let compareList = JSON.parse(localStorage.getItem('compareList')) || {};

    if (!compareList[productName]) {
        compareList[productName] = {
            image: productImage,
            features: productFeatures
        };
        compareCount++;
        icon.src = "/pictures/icon3Add.png"; 
        showNotification('Додано до порівняння');
    } else {
        delete compareList[productName];
        compareCount--;
        icon.src = "/pictures/icon3.png"; 
        showNotification('Видалено з порівняння');
    }

    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCounts();
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
                  <li><a href="link_to_laptop1">Ноутбуки</a></li>
                  <li><a href="link_to_laptop2">Планшети</a></li>
                  <li><a href="link_to_laptop3">Монітори</a></li>
                  <li><a href="link_to_laptop4">Відеокарти</a></li>
                  <li><a href="link_to_laptop5">SSD</a></li>
                  <li><a href="link_to_laptop6">Маршрутизатори</a></li>
                  <li><a href="link_to_laptop7">Моноблоки</a></li>
                  <li><a href="link_to_laptop8">Процесори</a></li>
                  <li><a href="link_to_laptop9">Зарядні станції</a></li>
                  <li><a href="link_to_laptop10">Джерела безперебійного живлення</a></li>
               </div>
               <div class="laptop-column">
                  <li><a href="link_to_laptop11">Акумулятори для ДБЖ</a></li>
                  <li><a href="link_to_laptop12">Оперативна пам'ять</a></li>
                  <li><a href="link_to_laptop13">Жорсткі диски та дискові масиви</a></li>
                  <li><a href="link_to_laptop14">Материнські плати</a></li>
                  <li><a href="link_to_laptop15">БФП/Принтери</a></li>
                  <li><a href="link_to_laptop16">Блоки живлення</a></li>
                  <li><a href="link_to_laptop17">Ігрові миші</a></li>
                  <li><a href="link_to_laptop18">Флеш пам'ять USB</a></li>
                  <li><a href="link_to_laptop19">Мережеві фільтри, адаптери та подовжувачі</a></li>
                   <li><a href="link_to_laptop20">Сумки, рюкзаки та чохли для ноутбуків</a></li>
               </div>
               <div class="laptop-column">
                   <li><a href="link_to_laptop21">Підставки та столики для ноутбуків</a></li>
                   <li><a href="link_to_laptop22">Веб-камери</a></li>
                   <li><a href="link_to_laptop23">Навушники</a></li>
                   <li><a href="link_to_laptop24">Мікрофони</a></li>
                   <li><a href="link_to_laptop25">Маршрутизатори</a></li>
                   <li><a href="link_to_laptop26">Комутатори</a></li>
                   <li><a href="link_to_laptop27">Мережеві адаптери</a></li>
                   <li><a href="link_to_laptop28">Ретранслятори Wi-Fi</a></li>
                   <li><a href="link_to_laptop29">Бездротові точки доступу</a></li>
                   <li><a href="link_to_laptop30">Мережеві сховища (NAS)</a></li>
               </div>
            </div>
        `;
    } else if (category === 'smartphones') {
        products = `
            <h3>Смартфони, ТВ і електроніка</h3>
            <div class="smartphone-list">
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone1">Мобільні телефони</a></li>
                    <li><a href="link_to_smartphone2">Універсальні мобільні батареї</a></li>
                    <li><a href="link_to_smartphone3">Зарядні станції</a></li>
                    <li><a href="link_to_smartphone4">Планшети</a></li>
                    <li><a href="link_to_smartphone5">Телевізори</a></li>
                    <li><a href="link_to_smartphone6">Навушники</a></li>
                    <li><a href="link_to_smartphone7">Смарт-годинники</a></li>
                    <li><a href="link_to_smartphone8">Акумулятори та батарейки</a></li>
                    <li><a href="link_to_smartphone9">Кабелі та адаптери</a></li>
                    <li><a href="link_to_smartphone10">Зарядні пристрої</a></li>
                </div>
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone11">Портативні колонки</a></li>
                    <li><a href="link_to_smartphone12">Смарт-годинники</a></li>
                    <li><a href="link_to_smartphone13">Apple Watch</a></li>
                    <li><a href="link_to_smartphone14">Фітнес-браслети</a></li>
                    <li><a href="link_to_smartphone15">Планшети</a></li>
                    <li><a href="link_to_smartphone16">Аксесуари для планшетів</a></li>
                    <li><a href="link_to_smartphone17">Аксесуари для смарт-годинників і трекерів</a></li>
                    <li><a href="link_to_smartphone18">Електронні книги</a></li>
                    <li><a href="link_to_smartphone19">Диктофони</a></li>
                </div>
                <div class="smartphone-column">
                    <li><a href="link_to_smartphone20">Комп'ютерні колонки</a></li>
                    <li><a href="link_to_smartphone21">Медіаплеєри</a></li>
                    <li><a href="link_to_smartphone22">Домашні кінотеатри</a></li>
                    <li><a href="link_to_smartphone23">Музичні центри та магнітоли</a></li>
                </div>
            </div>
        `;
    } else if (category === 'gaming') {
        products = `
            <h3>Товари для геймерів</h3>
            <div class="gaming-list">
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set1">PlayStation</a></li>
                    <li><a href="link_to_gaming_set2">Ігрові приставки PlayStation 5</a></li>
                    <li><a href="link_to_gaming_set3">Ігрові ноутбуки</a></li>
                    <li><a href="link_to_gaming_set4">Ігрові приставки PlayStation</a></li>
                    <li><a href="link_to_gaming_set5">Ігри для PlayStation 5</a></li>
                    <li><a href="link_to_gaming_set6">Ігри для PlayStation 4</a></li>
                    <li><a href="link_to_gaming_set7">Ігри для Xbox Series S/X</a></li>
                    <li><a href="link_to_gaming_set8">Ігри для Xbox One</a></li>
                    <li><a href="link_to_gaming_set9">Ігри для Nintendo Switch</a></li>
                    <li><a href="link_to_gaming_set10">Ігри для PC</a></li>
                </div>
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set11">Ігрові приставки PlayStation 4</a></li>
                    <li><a href="link_to_gaming_set12">Ігрові комп'ютери</a></li>
                    <li><a href="link_to_gaming_set13">Ігрові монітори</a></li>
                    <li><a href="link_to_gaming_set14">Ігрові ноутбуки Asus</a></li>
                    <li><a href="link_to_gaming_set15">Ігрові клавіатури</a></li>
                    <li><a href="link_to_gaming_set16">Ігрові миші</a></li>
                    <li><a href="link_to_gaming_set17">Ігрові ноутбуки HP</a></li>
                    <li><a href="link_to_gaming_set18">Ігрові гарнітури</a></li>
                    <li><a href="link_to_gaming_set19">Ігрові монітори Samsung</a></li>
                    <li><a href="link_to_gaming_set20">Ігрові крісла</a></li>
                </div>
                <div class="gaming-column">
                    <li><a href="link_to_gaming_set21">Маніпулятори, джойстики</a></li>
                    <li><a href="link_to_gaming_set22">Мікрофони</a></li>
                    <li><a href="link_to_gaming_set23">Відеокарти</a></li>
                    <li><a href="link_to_gaming_set24">Шоломи VR PlayStation</a></li>
                    <li><a href="link_to_gaming_set25">Геймпади PlayStation</a></li>
                    <li><a href="link_to_gaming_set26">Гарнітури PlayStation</a></li>
                    <li><a href="link_to_gaming_set27">Аксесуари PlayStation</a></li>
                    <li><a href="link_to_gaming_set28">Ігри для PlayStation 5</a></li>
                    <li><a href="link_to_gaming_set29">Ігри для PlayStation 4</a></li>
                    <li><a href="link_to_gaming_set30">Навушники</a></li>
                </div>
            </div>
        `;
    } else if (category === 'home_appliances') {
        products = `
            <h3>Побутова техніка</h3>
            <div class="appliance-list">
                <div class="appliance-column">
                    <li><a href="link_to_appliance1">Пральні машини</a></li>
                    <li><a href="link_to_appliance2">Акумуляторні пилососи</a></li>
                    <li><a href="link_to_appliance3">Холодильники</a></li>
                    <li><a href="link_to_appliance4">Мультипічки і аерогрилі</a></li>
                    <li><a href="link_to_appliance5">Посудомийні машини</a></li>
                    <li><a href="link_to_appliance6">Зубні щітки, іригатори та насадки</a></li>
                    <li><a href="link_to_appliance7">Кавомашини</a></li>
                    <li><a href="link_to_appliance8">Мікрохвильові печі</a></li>
                    <li><a href="link_to_appliance9">Тримери</a></li>
                    <li><a href="link_to_appliance10">Роботи-пилососи</a></li>
                </div>
                <div class="appliance-column">
                    <li><a href="link_to_appliance11">Вбудована техніка</a></li>
                    <li><a href="link_to_appliance12">Грилі та електрошашличниці</a></li>
                    <li><a href="link_to_appliance13">Прилади для укладання волосся</a></li>
                    <li><a href="link_to_appliance14">Праски</a></li>
                    <li><a href="link_to_appliance15">Обігрівачі</a></li>
                    <li><a href="link_to_appliance16">Пральні машини із сушаркою</a></li>
                    <li><a href="link_to_appliance17">Плити</a></li>
                    <li><a href="link_to_appliance18">Вбудовувані духові шафи</a></li>
                    <li><a href="link_to_appliance19">Сушильні автомати</a></li>
                    <li><a href="link_to_appliance20">Вбудовувані варильні поверхні</a></li>
                </div>
                <div class="appliance-column">
                    <li><a href="link_to_appliance21">Комплекти вбудованої техніки</a></li>
                    <li><a href="link_to_appliance22">Морозильні камери</a></li>
                    <li><a href="link_to_appliance23">Кухонні витяжки</a></li>
                    <li><a href="link_to_appliance24">Зубні щітки та іригатори</a></li>
                    <li><a href="link_to_appliance25">Фени</a></li>
                    <li><a href="link_to_appliance26">Стайлери</a></li>
                    <li><a href="link_to_appliance27">Плойки</a></li>
                    <li><a href="link_to_appliance28">Тримери</a></li>
                    <li><a href="link_to_appliance29">Електробритви</a></li>
                    <li><a href="link_to_appliance30">Масажери</a></li>
                </div>
            </div>
        `;
    } else if (category === 'home_goods') {
        products = `
            <h3>Товари для дому</h3>
            <div class="home-product-list">
                <div class="home-product-column">
                    <li><a href="link_to_laptop1">Геймерські крісла</a></li>
                    <li><a href="link_to_laptop2">Матраци</a></li>
                    <li><a href="link_to_laptop3">Постільна білизна</a></li>
                    <li><a href="link_to_laptop4">Лампи</a></li>
                    <li><a href="link_to_laptop5">Засоби для прання</a></li>
                    <li><a href="link_to_laptop6">Драбини, підмостки</a></li>
                    <li><a href="link_to_laptop7">Сковороди</a></li>
                    <li><a href="link_to_laptop8">Ковдри</a></li>
                    <li><a href="link_to_laptop9">Подушки</a></li>
                    <li><a href="link_to_laptop10">Комплекти сигналізації</a></li>
                </div>
                <div class="home-product-column">
                    <li><a href="link_to_laptop11">Електрокаміни</a></li>
                    <li><a href="link_to_laptop12">Сушарки для одягу</a></li>
                    <li><a href="link_to_laptop13">Наручні годинники</a></li>
                    <li><a href="link_to_laptop14">Комп'ютерні столи</a></li>
                    <li><a href="link_to_laptop15">Постільна білизна</a></li>
                    <li><a href="link_to_laptop16">Матраци</a></li>
                    <li><a href="link_to_laptop17">Ковдри</a></li>
                    <li><a href="link_to_laptop18">Подушки</a></li>
                    <li><a href="link_to_laptop19">Пледи</a></li>
                    <li><a href="link_to_laptop20">Рушники</a></li>
                </div>
                <div class="home-product-column">
                    <li><a href="link_to_laptop21">Покривала</a></li>
                    <li><a href="link_to_laptop22">Лампочки</a></li>
                    <li><a href="link_to_laptop23">Настільні лампи</a></li>
                    <li><a href="link_to_laptop24">Люстри</a></li>
                    <li><a href="link_to_laptop25">Вуличне освітлення</a></li>
                    <li><a href="link_to_laptop26">Настінні світильники</a></li>
                    <li><a href="link_to_laptop27">Стельові світильники</a></li>
                    <li><a href="link_to_laptop28">Точкові світильники</a></li>
                    <li><a href="link_to_laptop29">Настінні годинники</a></li>
                    <li><a href="link_to_laptop30">Настільні годинники</a></li>
                </div>
            </div>
        `;
    } else if (category === 'tools') {
        products = `
            <h3>Інструменти та автотовари</h3>
                <div class="tool-product-list">
                    <div class="tool-product-column">
                        <li><a href="link_to_laptop1">Генератори</a></li>
                        <li><a href="link_to_laptop2">Автомобільні акумулятори</a></li>
                        <li><a href="link_to_laptop3">Шурупокрути</a></li>
                        <li><a href="link_to_laptop4">Шини</a></li>
                        <li><a href="link_to_laptop5">Інвертори для сонячних батарей</a></li>
                        <li><a href="link_to_laptop6">Автокомпресори</a></li>
                        <li><a href="link_to_laptop7">Набори інструментів</a></li>
                        <li><a href="link_to_laptop8">Автомастила</a></li>
                        <li><a href="link_to_laptop9">Універсальні мийки</a></li>
                        <li><a href="link_to_laptop10">Зимовий склоомивач</a></li>
                    </div>
                    <div class="tool-product-column">
                        <li><a href="link_to_laptop11">Автомагнітоли</a></li>
                        <li><a href="link_to_laptop12">Штатні головні пристрої</a></li>
                        <li><a href="link_to_laptop13">Автоакустика</a></li>
                        <li><a href="link_to_laptop14">FM-трансмітери</a></li>
                        <li><a href="link_to_laptop15">Сабвуфери</a></li>
                        <li><a href="link_to_laptop16">Автофільтри</a></li>
                        <li><a href="link_to_laptop17">Гальмівна система</a></li>
                        <li><a href="link_to_laptop18">Система запалювання</a></li>
                        <li><a href="link_to_laptop19">Підвіска автомобіля</a></li>
                        <li><a href="link_to_laptop20">Система охолодження двигуна</a></li>
                    </div>
                    <div class="tool-product-column">
                        <li><a href="link_to_laptop21">Кермове керування</a></li>
                        <li><a href="link_to_laptop22">Трансмісія та зчеплення</a></li>
                        <li><a href="link_to_laptop23">Електрика</a></li>
                        <li><a href="link_to_laptop24">Паливна система</a></li>
                        <li><a href="link_to_laptop25">Вихлопні системи</a></li>
                        <li><a href="link_to_laptop26">Кузов автомобіля</a></li>
                        <li><a href="link_to_laptop27">Домкрати</a></li>
                        <li><a href="link_to_laptop28">Каністри</a></li>
                        <li><a href="link_to_laptop29">Вогнегасники</a></li>
                        <li><a href="link_to_laptop30">Пускозарядні пристрої</a></li>
                    </div>
                </div>
        `;
    } else if (category === 'plumbing') {
        products = `
            <h3>Сантехніка та ремонт</h3>
                <div class="plumbing-product-list">
                    <div class="plumbing-product-column">
                        <li><a href="link_to_plumbing1">Настільні лампи</a></li>
                        <li><a href="link_to_plumbing2">Печі</a></li>
                        <li><a href="link_to_plumbing3">Ванни</a></li>
                        <li><a href="link_to_plumbing4">Унітази</a></li>
                        <li><a href="link_to_plumbing5">Ґрунтовка</a></li>
                        <li><a href="link_to_plumbing6">Фарба</a></li>
                        <li><a href="link_to_plumbing7">Ламінат</a></li>
                        <li><a href="link_to_plumbing8">Двері</a></li>
                        <li><a href="link_to_plumbing9">Люстри</a></li>
                        <li><a href="link_to_plumbing10">Керамiка</a></li>
                    </div>
                    <div class="plumbing-product-column">
                        <li><a href="link_to_plumbing11">Змішувачі</a></li>
                        <li><a href="link_to_plumbing12">Шпалери</a></li>
                        <li><a href="link_to_plumbing13">Душові кабіни</a></li>
                        <li><a href="link_to_plumbing14">Технічні світильники</a></li>
                        <li><a href="link_to_plumbing15">Електрокаміни</a></li>
                        <li><a href="link_to_plumbing16">Декоративна штукатурка</a></li>
                        <li><a href="link_to_plumbing17">Сушарки для рушників</a></li>
                        <li><a href="link_to_plumbing18">Монтажні стрічки</a></li>
                        <li><a href="link_to_plumbing19">Покрівля</a></li>
                        <li><a href="link_to_plumbing20">Цемент</a></li>
                    </div>
                    <div class="plumbing-product-column">
                        <li><a href="link_to_plumbing21">Подрібнювачі</a></li>
                        <li><a href="link_to_plumbing22">Душові гарнітури</a></li>
                        <li><a href="link_to_plumbing23">Системи вентиляції</a></li>
                        <li><a href="link_to_plumbing24">Фарба</a></li>
                        <li><a href="link_to_plumbing25">Будівельні матеріали</a></li>
                        <li><a href="link_to_plumbing26">Печі, булер'яни</a></li>
                        <li><a href="link_to_plumbing27">Шпаклівка</a></li>
                        <li><a href="link_to_plumbing28">Вінілові шпалери</a></li>
                        <li><a href="link_to_plumbing29">Аксесуари для камінів</a></li>
                        <li><a href="link_to_plumbing30">Світлодіодні лампи</a></li>
                    </div>
                </div>
        `;
    } else if (category === 'garden') {
        products = `
            <h3>Дача, сад і город</h3>
            <div class="garden-product-list">
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product1">Акумуляторні пилки</a></li>
                    <li><a href="link_to_garden_product2">Кущорізи</a></li>
                    <li><a href="link_to_garden_product3">Електропили</a></li>
                    <li><a href="link_to_garden_product4">Обприскувачі</a></li>
                    <li><a href="link_to_garden_product5">Лопати</a></li>
                    <li><a href="link_to_garden_product6">Бензопили</a></li>
                    <li><a href="link_to_garden_product7">Секатори</a></li>
                    <li><a href="link_to_garden_product8">Вазони</a></li>
                    <li><a href="link_to_garden_product9">Граблі</a></li>
                    <li><a href="link_to_garden_product10">Садові ножі</a></li>
                </div>
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product11">Тачки</a></li>
                    <li><a href="link_to_garden_product12">Сміттєві контейнери</a></li>
                    <li><a href="link_to_garden_product13">Насіння</a></li>
                    <li><a href="link_to_garden_product14">Тримери</a></li>
                    <li><a href="link_to_garden_product15">Мотоблоки</a></li>
                    <li><a href="link_to_garden_product16">Садове приладдя</a></li>
                    <li><a href="link_to_garden_product17">Садовий інвентар</a></li>
                    <li><a href="link_to_garden_product18">Зрошувачі</a></li>
                    <li><a href="link_to_garden_product19">Басейни</a></li>
                    <li><a href="link_to_garden_product20">Садовий інструмент</a></li>
                </div>
                <div class="garden-product-column">
                    <li><a href="link_to_garden_product21">Держаки</a></li>
                    <li><a href="link_to_garden_product22">Садові подрібнювачі</a></li>
                    <li><a href="link_to_garden_product23">Фунгіциди</a></li>
                    <li><a href="link_to_garden_product24">Інсектициди</a></li>
                    <li><a href="link_to_garden_product25">Субстрати</a></li>
                    <li><a href="link_to_garden_product26">Насіння трав</a></li>
                    <li><a href="link_to_garden_product27">Аератори</a></li>
                    <li><a href="link_to_garden_product28">Мінеральні добрива</a></li>
                    <li><a href="link_to_garden_product29">Отрута</a></li>
                    <li><a href="link_to_garden_product30">Драбини</a></li>
                </div>
            </div>
        `;
    } else if (category === 'sports') {
        products = `
            <h3>Спорт і захоплення</h3>
            <div class="sport-product-list">
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product1">Бігові доріжки</a></li>
                    <li><a href="link_to_sport_product2">Гантелі</a></li>
                    <li><a href="link_to_sport_product3">Йога</a></li>
                    <li><a href="link_to_sport_product4">Протеїни</a></li>
                    <li><a href="link_to_sport_product5">Креатин</a></li>
                    <li><a href="link_to_sport_product6">Еспандери</a></li>
                    <li><a href="link_to_sport_product7">М'ячі</a></li>
                    <li><a href="link_to_sport_product8">Велосипеди</a></li>
                    <li><a href="link_to_sport_product9">Рації</a></li>
                    <li><a href="link_to_sport_product10">Тренажери</a></li>
                </div>
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product11">Велоаксесуари</a></li>
                    <li><a href="link_to_sport_product12">Електроскутери</a></li>
                    <li><a href="link_to_sport_product13">Мангали</a></li>
                    <li><a href="link_to_sport_product14">Намети</a></li>
                    <li><a href="link_to_sport_product15">Складані меблі</a></li>
                    <li><a href="link_to_sport_product16">Надувні меблі</a></li>
                    <li><a href="link_to_sport_product17">Бокс</a></li>
                    <li><a href="link_to_sport_product18">Фітнес</a></li>
                    <li><a href="link_to_sport_product19">Човни</a></li>
                    <li><a href="link_to_sport_product20">Туризм</a></li>
                </div>
                <div class="sport-product-column">
                    <li><a href="link_to_sport_product21">Вудилища</a></li>
                    <li><a href="link_to_sport_product22">Риболовля</a></li>
                    <li><a href="link_to_sport_product23">Музичні інструменти</a></li>
                    <li><a href="link_to_sport_product24">Ліхтарі</a></li>
                    <li><a href="link_to_sport_product25">Квадрокоптери</a></li>
                    <li><a href="link_to_sport_product26">Смичкові інструменти</a></li>
                    <li><a href="link_to_sport_product27">Ударні інструменти</a></li>
                    <li><a href="link_to_sport_product28">Газові балони</a></li>
                    <li><a href="link_to_sport_product29">Окуляри</a></li>
                    <li><a href="link_to_sport_product30">Шапочки</a></li>
                </div>
            </div>
        `;
    } else if (category === 'clothing') {
        products = `
            <h3>Одяг, взуття та прикраси</h3>
                <div class="clothing-list">
                    <div class="clothing-column">
                        <li><a href="link_to_clothing1">Жінкам</a></li>
                        <li><a href="link_to_clothing2">Чоловікам</a></li>
                        <li><a href="link_to_clothing3">Дітям</a></li>
                        <li><a href="link_to_clothing4">Спорт</a></li>
                        <li><a href="link_to_clothing5">Плаття</a></li>
                        <li><a href="link_to_clothing6">Джинси</a></li>
                        <li><a href="link_to_clothing7">Футболки</a></li>
                        <li><a href="link_to_clothing8">Толстовки</a></li>
                        <li><a href="link_to_clothing9">Кросівки</a></li>
                        <li><a href="link_to_clothing10">Туфлі</a></li>
                    </div>
                    <div class="clothing-column">
                        <li><a href="link_to_clothing11">Шкарпетки</a></li>
                        <li><a href="link_to_clothing12">Спідня білизна</a></li>
                        <li><a href="link_to_clothing13">Аксесуари</a></li>
                        <li><a href="link_to_clothing14">Рюкзаки</a></li>
                        <li><a href="link_to_clothing15">Сумки</a></li>
                        <li><a href="link_to_clothing16">Парасолі</a></li>
                        <li><a href="link_to_clothing17">Головні убори</a></li>
                        <li><a href="link_to_clothing18">Кеди</a></li>
                        <li><a href="link_to_clothing19">Чоботи</a></li>
                        <li><a href="link_to_clothing20">Кросівки</a></li>
                    </div>
                    <div class="clothing-column">
                        <li><a href="link_to_clothing21">Спортивні костюми</a></li>
                        <li><a href="link_to_clothing22">Мокасини</a></li>
                        <li><a href="link_to_clothing23">Черевики</a></li>
                        <li><a href="link_to_clothing24">Шльопанці</a></li>
                        <li><a href="link_to_clothing25">Ремені</a></li>
                        <li><a href="link_to_clothing26">Портмоне</a></li>
                        <li><a href="link_to_clothing27">Верхній одяг</a></li>
                        <li><a href="link_to_clothing28">Спортивні штани</a></li>
                        <li><a href="link_to_clothing29">Худі</a></li>
                        <li><a href="link_to_clothing30">Чоловіче взуття</a></li>
                    </div> 
                 </div>
        `;
    } else if (category === 'beauty') {
        products = `
            <h3>Краса та здоров'я</h3>
            <div class="beauty-list">
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product1">Парфуми</a></li>
                    <li><a href="link_to_beauty_product2">Помада</a></li>
                    <li><a href="link_to_beauty_product3">Дерматокосметика</a></li>
                    <li><a href="link_to_beauty_product4">Фени</a></li>
                    <li><a href="link_to_beauty_product5">Масажери</a></li>
                    <li><a href="link_to_beauty_product6">Крем</a></li>
                    <li><a href="link_to_beauty_product7">Туш для вій</a></li>
                    <li><a href="link_to_beauty_product8">Зубні щітки</a></li>
                    <li><a href="link_to_beauty_product9">Шампуні</a></li>
                    <li><a href="link_to_beauty_product10">Кондиціонери</a></li>
                </div>
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product11">Триммери</a></li>
                    <li><a href="link_to_beauty_product12">Електробритви</a></li>
                    <li><a href="link_to_beauty_product13">Догляд за руками</a></li>
                    <li><a href="link_to_beauty_product14">Гель-лак</a></li>
                    <li><a href="link_to_beauty_product15">Лак для нігтів</a></li>
                    <li><a href="link_to_beauty_product16">Тональні засоби</a></li>
                    <li><a href="link_to_beauty_product17">Пудра</a></li>
                    <li><a href="link_to_beauty_product18">Засіб для вмивання</a></li>
                    <li><a href="link_to_beauty_product19">Ваги підлогові</a></li>
                    <li><a href="link_to_beauty_product20">Інгалятори</a></li>
                </div>
                <div class="beauty-column">
                    <li><a href="link_to_beauty_product21">Епілятори</a></li>
                    <li><a href="link_to_beauty_product22">Маска для обличчя</a></li>
                    <li><a href="link_to_beauty_product23">Машинки для стриження</a></li>
                    <li><a href="link_to_beauty_product24">Засоби контрацепції</a></li>
                    <li><a href="link_to_beauty_product25">Товари з уцінкою</a></li>
                    <li><a href="link_to_beauty_product26">Аксесуари</a></li>
                    <li><a href="link_to_beauty_product27">Засоби для гоління</a></li>
                    <li><a href="link_to_beauty_product28">Товари медичного призначення</a></li>
                    <li><a href="link_to_beauty_product29">Догляд за волоссям</a></li>
                    <li><a href="link_to_beauty_product30">Косметика та парфюмерія</a></li>
                </div>
            </div>
        `;
    } else if (category === 'kids') {
        products = `
            <h3>Дитячі товари</h3>
            <div class="kids-list">
                <div class="kids-column">
                    <li><a href="link_to_kids_product1">Підгузки</a></li>
                    <li><a href="link_to_kids_product2">Ляльки</a></li>
                    <li><a href="link_to_kids_product3">М'які іграшки</a></li>
                    <li><a href="link_to_kids_product4">Іграшки</a></li>
                    <li><a href="link_to_kids_product5">Іграшкові машинки та техніка</a></li>
                    <li><a href="link_to_kids_product6">Творчість</a></li>
                    <li><a href="link_to_kids_product7">Дитяче харчування</a></li>
                    <li><a href="link_to_kids_product8">Інтерактивні іграшки</a></li>
                    <li><a href="link_to_kids_product9">Дитячі суміші</a></li>
                    <li><a href="link_to_kids_product10">Дитячі велосипеди</a></li>
                </div>
                <div class="kids-column">
                    <li><a href="link_to_kids_product11">Дитячі коляски</a></li>
                    <li><a href="link_to_kids_product12">Іграшки для малюків</a></li>
                    <li><a href="link_to_kids_product13">Дитячі автокрісла</a></li>
                    <li><a href="link_to_kids_product14">Дитячі самокати</a></li>
                    <li><a href="link_to_kids_product15">Дитячі кухонні комбайни</a></li>
                    <li><a href="link_to_kids_product16">Стільчики для годування</a></li>
                    <li><a href="link_to_kids_product17">Розвиток та творчість</a></li>
                    <li><a href="link_to_kids_product18">Пляшечки для годування</a></li>
                    <li><a href="link_to_kids_product19">Гігієна та догляд за дитиною</a></li>
                    <li><a href="link_to_kids_product20">Манежі</a></li>
                </div>
                <div class="kids-column">
                    <li><a href="link_to_kids_product21">Мобілі</a></li>
                    <li><a href="link_to_kids_product22">Дитячі ліжечка</a></li>
                    <li><a href="link_to_kids_product23">Дитячі серветки</a></li>
                    <li><a href="link_to_kids_product24">Дитячий одяг, взуття та аксесуари</a></li>
                    <li><a href="link_to_kids_product25">Шкільне приладдя</a></li>
                    <li><a href="link_to_kids_product26">Набори для наукових досліджень</a></li>
                    <li><a href="link_to_kids_product27">Дитячі комп'ютери</a></li>
                    <li><a href="link_to_kids_product28">Розвивальні килимки</a></li>
                    <li><a href="link_to_kids_product29">Пазли</a></li>
                    <li><a href="link_to_kids_product30">Дивомобілі</a></li>
                </div>
            </div>
        `;
    } else if (category === 'pets') {
        products = `
           <h3>Зоотовари</h3>
            <div class="pet-list">
                <div class="pet-column">
                    <li><a href="link_to_pet_product1">Корми для тварин</a></li>
                    <li><a href="link_to_pet_product2">Іграшки</a></li>
                    <li><a href="link_to_pet_product3">Вітаміни</a></li>
                    <li><a href="link_to_pet_product4">Одяг</a></li>
                    <li><a href="link_to_pet_product5">Нашийники</a></li>
                    <li><a href="link_to_pet_product6">Повідці</a></li>
                    <li><a href="link_to_pet_product7">Туалети</a></li>
                    <li><a href="link_to_pet_product8">Спальні місця</a></li>
                    <li><a href="link_to_pet_product9">Посуд</a></li>
                    <li><a href="link_to_pet_product10">Аксесуари</a></li>
                </div>
                <div class="pet-column">
                    <li><a href="link_to_pet_product11">Корми для собак</a></li>
                    <li><a href="link_to_pet_product12">Нашийники</a></li>
                    <li><a href="link_to_pet_product13">Вологий корм</a></li>
                    <li><a href="link_to_pet_product14">Сухий корм</a></li>
                    <li><a href="link_to_pet_product15">Посуд для тварин</a></li>
                    <li><a href="link_to_pet_product16">Наповнювачі</a></li>
                    <li><a href="link_to_pet_product17">Товари для котів</a></li>
                    <li><a href="link_to_pet_product18">Грумінг</a></li>
                    <li><a href="link_to_pet_product19">Клітки</a></li>
                    <li><a href="link_to_pet_product20">Декорації</a></li>
                </div>
                <div class="pet-column">
                    <li><a href="link_to_pet_product21">Товари для птахів</a></li>
                    <li><a href="link_to_pet_product22">Компресори</a></li>
                    <li><a href="link_to_pet_product23">Фільтри</a></li>
                    <li><a href="link_to_pet_product24">Акваріуми</a></li>
                    <li><a href="link_to_pet_product25">Корм для риб</a></li>
                    <li><a href="link_to_pet_product26">Нашийники від бліх</a></li>
                    <li><a href="link_to_pet_product27">Засоби від паразитів</a></li>
                    <li><a href="link_to_pet_product28">Обігрів</a></li>
                    <li><a href="link_to_pet_product29">Засоби проти глистів</a></li>
                    <li><a href="link_to_pet_product30">Засоби для грумінгу</a></li>
                </div>
            </div>
        `;
    } else if (category === 'office') {
        products = `
            <h3>Офіс, школа, книги</h3>
            <div class="office-list">
                <div class="office-column">
                    <li><a href="link_to_office_product1">Ручки</a></li>
                    <li><a href="link_to_office_product2">Олівці</a></li>
                    <li><a href="link_to_office_product3">Клей</a></li>
                    <li><a href="link_to_office_product4">Гумки</a></li>
                    <li><a href="link_to_office_product5">Калькулятори</a></li>
                    <li><a href="link_to_office_product6">Фломастери</a></li>
                    <li><a href="link_to_office_product7">Папір офісний</a></li>
                    <li><a href="link_to_office_product8">Степлери, антистеплери</a></li>
                    <li><a href="link_to_office_product9">Товари з уцінкою</a></li>
                    <li><a href="link_to_office_product10">Настільні набори</a></li>
                </div>
                <div class="office-column">
                    <li><a href="link_to_office_product11">Маркери</a></li>
                    <li><a href="link_to_office_product12">Канцелярське приладдя</a></li>
                    <li><a href="link_to_office_product13">Блокноти</a></li>
                    <li><a href="link_to_office_product14">Діркопробивачі</a></li>
                    <li><a href="link_to_office_product15">Папки пластикові</a></li>
                    <li><a href="link_to_office_product16">Папки з файлами</a></li>
                    <li><a href="link_to_office_product17">Пенали шкільні</a></li>
                    <li><a href="link_to_office_product18">Щоденники</a></li>
                    <li><a href="link_to_office_product19">Папір для нотаток</a></li>
                    <li><a href="link_to_office_product20">Обкладинки для зошитів</a></li>
                </div>
                <div class="office-column">
                    <li><a href="link_to_office_product21">Папки-реєстратори</a></li>
                    <li><a href="link_to_office_product22">Циркулі</a></li>
                    <li><a href="link_to_office_product23">Фарби</a></li>
                    <li><a href="link_to_office_product24">Пензлі</a></li>
                    <li><a href="link_to_office_product25">Папір для фліпчартів</a></li>
                    <li><a href="link_to_office_product26">Папір для фліпчартів</a></li>
                    <li><a href="link_to_office_product27">Бейджі</a></li>
                    <li><a href="link_to_office_product28">Лотки для паперів</a></li>
                    <li><a href="link_to_office_product29">Обкладинки для підручників</a></li>
                    <li><a href="link_to_office_product30">Папки-портфелі</a></li>
                </div>
            </div>
        `;
    } else if (category === 'alcohol') {
        products = `
            <h3>Алкогольні напої та продукти</h3>
            <div class="alcohol-list">
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol1">Вино</a></li>
                    <li><a href="link_to_alcohol2">Пиво</a></li>
                    <li><a href="link_to_alcohol3">Лікери</a></li>
                    <li><a href="link_to_alcohol4">Коньяк</a></li>
                    <li><a href="link_to_alcohol5">Ром</a></li>
                    <li><a href="link_to_alcohol6">Текіла</a></li>
                    <li><a href="link_to_alcohol7">Горілка</a></li>
                    <li><a href="link_to_alcohol8">Джин</a></li>
                    <li><a href="link_to_alcohol9">Віскі бленд</a></li>
                    <li><a href="link_to_alcohol10">Абсент</a></li>
                </div>
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol11">Сиропи</a></li>
                    <li><a href="link_to_alcohol12">Чай</a></li>
                    <li><a href="link_to_alcohol13">Кава</a></li>
                    <li><a href="link_to_alcohol14">Жувальна гумка</a></li>
                    <li><a href="link_to_alcohol15">Снеки</a></li>
                    <li><a href="link_to_alcohol16">Олія</a></li>
                    <li><a href="link_to_alcohol17">Оливки</a></li>
                    <li><a href="link_to_alcohol18">Джем</a></li>
                    <li><a href="link_to_alcohol19">Макаронні вироби</a></li>
                    <li><a href="link_to_alcohol20">Цукерки</a></li>
                </div>
                <div class="alcohol-column">
                    <li><a href="link_to_alcohol21">Слабоалкогольні напої</a></li>
                    <li><a href="link_to_alcohol22">Келихи</a></li>
                    <li><a href="link_to_alcohol23">Грапа</a></li>
                    <li><a href="link_to_alcohol24">Бренді</a></li>
                    <li><a href="link_to_alcohol25">Посуд</a></li>
                    <li><a href="link_to_alcohol26">Сигарети</a></li>
                    <li><a href="link_to_alcohol27">Сухофрукти</a></li>
                    <li><a href="link_to_alcohol28">Сир</a></li>
                    <li><a href="link_to_alcohol29">Приправи</a></li>
                    <li><a href="link_to_alcohol30">Біле</a></li>
                </div>
            </div>
        `;
    } else if (category === 'cleaning') {
        products = `
            <h3>Побутова хімія</h3>
            <div class="cleaning-list">
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning1">Засоби для прання</a></li>
                    <li><a href="link_to_cleaning2">Освіжувачі</a></li>
                    <li><a href="link_to_cleaning3">Туалетний папір</a></li>
                    <li><a href="link_to_cleaning4">Господарські</a></li>
                    <li><a href="link_to_cleaning5">Паперові рушники</a></li>
                    <li><a href="link_to_cleaning6">Засоби для кухні</a></li>
                    <li><a href="link_to_cleaning7">Засоби від комах</a></li>
                    <li><a href="link_to_cleaning8">Кондиціонери</a></li>
                    <li><a href="link_to_cleaning9">Пральні засоби</a></li>
                    <li><a href="link_to_cleaning10">Прибирання</a></li>
                </div>
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning11">Освіжувачі</a></li>
                    <li><a href="link_to_cleaning12">Засоби для миття</a></li>
                    <li><a href="link_to_cleaning13">Засоби для вікон</a></li>
                    <li><a href="link_to_cleaning14">Засоби для миття</a></li>
                    <li><a href="link_to_cleaning15">Засоби для посуду</a></li>
                    <li><a href="link_to_cleaning16">Отрута</a></li>
                    <li><a href="link_to_cleaning17">Хімія</a></li>
                    <li><a href="link_to_cleaning18">Засоби для кухні</a></li>
                    <li><a href="link_to_cleaning19">Догляд</a></li>
                    <li><a href="link_to_cleaning20">Господарські</a></li>
                </div>
                <div class="cleaning-column">
                    <li><a href="link_to_cleaning21">Туалетні</a></li>
                    <li><a href="link_to_cleaning22">Засоби для прання</a></li>
                    <li><a href="link_to_cleaning23">Для туалету</a></li>
                    <li><a href="link_to_cleaning24">Пакети</a></li>
                    <li><a href="link_to_cleaning25">Засоби для прання</a></li>
                    <li><a href="link_to_cleaning26">Засоби для миття</a></li>
                    <li><a href="link_to_cleaning27">Харчова упаковка</a></li>
                    <li><a href="link_to_cleaning28">Догляд</a></li>
                    <li><a href="link_to_cleaning29">Засоби для вигрібних</a></li>
                    <li><a href="link_to_cleaning30">Вулична зона</a></li>
                </div>
            </div>
        `;
    }        

    productList.innerHTML = products; 
}

