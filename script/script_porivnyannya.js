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
        icon.src = "/pictures/icon3Add.png"; 
        showNotification('Додано до порівняння');
    } else {
        delete compareList[productName];
        icon.src = "/pictures/icon3.png";
        showNotification('Видалено з порівняння');
    }

    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCounts(); 
}

function displayComparison() {
    const compareList = JSON.parse(localStorage.getItem('compareList')) || {};
    const comparisonContainer = document.getElementById('comparison-container');
    comparisonContainer.innerHTML = ''; 

    if (Object.keys(compareList).length === 0) {
        comparisonContainer.innerHTML = '<p>Товари для порівняння ще не додано.</p>';
        return;
    }

    for (const productName in compareList) {
        const product = compareList[productName];
        const productCard = document.createElement('div');
        productCard.className = 'comparison-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${productName}">
            <div class="product-name">${productName}</div>
            <h3>Короткі характеристики:</h3>
            <ul>
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        comparisonContainer.appendChild(productCard);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayComparison();
});








let compareProducts = [];

function addToCompare(product) {
    const productData = {
        image: product.getAttribute('data-image'), 
        name: product.getAttribute('data-name'),
        characteristics: product.getAttribute('data-characteristics').split(',')
    };

    if (!compareProducts.some(p => p.name === productData.name)) {
        compareProducts.push(productData);
        alert(`Додано до порівняння: ${productData.name}`);
    } else {
        alert(`Товар вже у списку порівняння: ${productData.name}`);
    }

    displayComparedProducts();
}

function removeFromCompare(productName) {
    console.log(`Спроба видалення: ${productName}`);

    compareProducts = compareProducts.filter(product => product.name !== productName);
    
    console.log('Залишилися товари:', compareProducts);

    displayComparedProducts(); 
}

function displayComparedProducts() {
    const compareList = document.getElementById("compare-list");
    compareList.innerHTML = ''; 

    compareProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <h3>Короткі характеристики:</h3>
            <ul>
                ${product.characteristics.map(char => `<li>${char}</li>`).join('')}
            </ul>
            <button onclick="removeFromCompare('${product.name}')">Видалити</button>
        `;

        compareList.appendChild(productDiv);
    });
}
