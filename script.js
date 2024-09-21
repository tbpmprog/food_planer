// Инициализация продуктов и расписания из localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];
let mealSchedule = JSON.parse(localStorage.getItem('mealSchedule')) || {
    "Завтрак": [],
    "Обед": [],
    "Ужин": [],
    "Перекус": []
};

// Количество записей на одну страницу
const productsPerPage = 10;
let currentPage = 1;

// Переменные для работы с модальным окном добавления
const addModal = document.getElementById('addProductModal');
const addForm = document.getElementById('addProductForm');
const addProductName = document.getElementById('newProductName');
const addProductCalories = document.getElementById('newProductCalories');
const addProductProteins = document.getElementById('newProductProteins');
const addProductFats = document.getElementById('newProductFats');
const addProductCarbs = document.getElementById('newProductCarbs');

// Переменные для работы с модальным окном
const editModal = document.getElementById('editProductModal');
const editForm = document.getElementById('editProductForm');
const editProductName = document.getElementById('editProductName');
const editProductCalories = document.getElementById('editProductCalories');
const editProductProteins = document.getElementById('editProductProteins');
const editProductFats = document.getElementById('editProductFats');
const editProductCarbs = document.getElementById('editProductCarbs');
let editIndex = null; // Индекс редактируемого продукта

// Функция для рендеринга списка продуктов
function renderProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <span>${product.name} - ${product.calories} ккал, 
            Белки: ${product.proteins || 0} г, 
            Жиры: ${product.fats || 0} г, 
            Углеводы: ${product.carbs || 0} г</span>
            <button onclick="editProduct(${index + start})">Редактировать</button>
            <button onclick="removeProduct(${index + start})">Удалить</button>
        `;
        productList.appendChild(productItem);
    });

    renderPagination();
}

// Функция для рендеринга кнопок пагинации
function renderPagination() {
    const paginationDiv = document.getElementById('productPagination');
    paginationDiv.innerHTML = '';

    const totalPages = Math.ceil(products.length / productsPerPage);

    if (totalPages <= 1) return; // Не отображать пагинацию, если одна страница

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function() {
            currentPage = i;
            renderProductList();
        });
        paginationDiv.appendChild(pageButton);
    }
}

// Открытие модального окна для добавления продукта
document.getElementById('addNewProductButton').addEventListener('click', function() {
    addModal.style.display = 'flex';
});

// Закрытие модального окна для добавления
document.querySelector('.close-add').addEventListener('click', function() {
    addModal.style.display = 'none';
});

// Добавление нового продукта
addForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Проверки данных
    const newName = addProductName.value.trim();
    const newCalories = Number(addProductCalories.value);
    const newProteins = Number(addProductProteins.value);
    const newFats = Number(addProductFats.value);
    const newCarbs = Number(addProductCarbs.value);

    if (newName === "" || isNaN(newCalories) || newCalories <= 0 || isNaN(newProteins) || isNaN(newFats) || isNaN(newCarbs)) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Добавляем новый продукт в список
    const product = {
        name: newName,
        calories: newCalories,
        proteins: newProteins,
        fats: newFats,
        carbs: newCarbs
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));  // Сохраняем продукт в localStorage
    renderProductList();  // Обновляем список продуктов
    addModal.style.display = 'none';  // Закрываем модальное окно после сохранения
    addForm.reset();  // Очищаем форму
});

// Открытие модального окна для редактирования продукта
function openEditModal(index) {
    const product = products[index];
    editProductName.value = product.name;
    editProductCalories.value = product.calories;
    editProductProteins.value = product.proteins || 0;
    editProductFats.value = product.fats || 0;
    editProductCarbs.value = product.carbs || 0;
    editIndex = index; // Сохраняем индекс редактируемого продукта
    editModal.style.display = 'flex'; // Показываем модальное окно
}

// Закрытие модального окна для редактирования
document.querySelector('.close').addEventListener('click', function() {
    editModal.style.display = 'none';
});

// Закрытие модальных окон при клике вне их
window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
    if (event.target == addModal) {
        addModal.style.display = 'none';
    }
};

// Сохранение изменений продукта
editForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Проверки данных
    const newName = editProductName.value.trim();
    const newCalories = Number(editProductCalories.value);
    const newProteins = Number(editProductProteins.value);
    const newFats = Number(editProductFats.value);
    const newCarbs = Number(editProductCarbs.value);

    if (newName === "" || isNaN(newCalories) || newCalories <= 0 || isNaN(newProteins) || isNaN(newFats) || isNaN(newCarbs)) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Сохранение изменений продукта
    products[editIndex] = {
        name: newName,
        calories: newCalories,
        proteins: newProteins,
        fats: newFats,
        carbs: newCarbs
    };

    localStorage.setItem('products', JSON.stringify(products));  // Сохраняем изменения в localStorage
    renderProductList();  // Перерисовываем список продуктов
    editModal.style.display = 'none'; // Закрываем модальное окно после сохранения
});

// Обновляем выпадающий список продуктов для выбора в планировщике
function updateProductSelect() {
    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = '<option value="">Выбрать продукт</option>';
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${product.name} - ${product.calories} ккал`;
        productSelect.appendChild(option);
    });
}

// Функция для рендеринга расписания на день
function renderMealSchedule() {
    const mealScheduleDiv = document.getElementById('mealSchedule');
    mealScheduleDiv.innerHTML = '';

    Object.keys(mealSchedule).forEach(mealTime => {
        const mealProducts = mealSchedule[mealTime];
        if (mealProducts.length > 0) {
            const totalCalories = mealProducts.reduce((sum, product) => sum + product.calories, 0);
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.innerHTML = `
                <div class="meal-time">${mealTime}</div>
                <div class="meal-products">${mealProducts.map(p => p.name).join(', ')}</div>
                <div class="meal-total">Общее количество калорий: ${totalCalories} ккал</div>
            `;
            mealScheduleDiv.appendChild(mealItem);
        }
    });
}

// Удаление продукта из справочника
function removeProduct(index) {
    if (confirm("Вы уверены, что хотите удалить этот продукт?")) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProductList();
        updateProductSelect();
    }
}

// Очистка справочника продуктов
document.getElementById('clearProducts').addEventListener('click', function() {
    if (confirm("Вы уверены, что хотите очистить весь справочник продуктов?")) {
        products = [];
        localStorage.setItem('products', JSON.stringify(products));
        renderProductList();
        updateProductSelect();
    }
});

// Добавляем прием пищи в расписание
document.getElementById('mealForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mealTime = document.getElementById('mealTime').value;
    const productIndex = document.getElementById('productSelect').value;

    if (mealTime === "" || productIndex === "") {
        alert("Пожалуйста, выберите прием пищи и продукт.");
        return;
    }

    const product = products[productIndex];

    // Добавляем продукт к соответствующему приему пищи
    mealSchedule[mealTime].push(product);
    localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));  // Сохраняем в localStorage
    renderMealSchedule();

    // Очищаем форму планирования
    document.getElementById('mealForm').reset();
});

// Очистка расписания на день
document.getElementById('clearSchedule').addEventListener('click', function() {
    if (confirm("Вы уверены, что хотите очистить расписание на день?")) {
        mealSchedule = {
            "Завтрак": [],
            "Обед": [],
            "Ужин": [],
            "Перекус": []
        };
        localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));
        renderMealSchedule();
    }
});

// Инициализация списков при загрузке страницы
window.onload = function() {
    renderProductList();
    renderMealSchedule();
    updateProductSelect();
};
