let cart = [];

// Load grocery list from localStorage on page load
function loadGroceryList() {
    const storedList = localStorage.getItem('groceryList');
    if (storedList) {
        return JSON.parse(storedList);
    }
    return groceryList; // Fallback to default list if nothing is stored
}

// Save grocery list to localStorage
function saveGroceryList() {
    localStorage.setItem('groceryList', JSON.stringify(groceryList));
}

// Function to get unique categories
function getCategories() {
    const categories = new Set(groceryList.map(item => item.category));
    categories.add('All'); // Add 'All' to the set of categories
    return Array.from(categories);
}

// Function to display category buttons
function displayCategories() {
    const categorySection = document.querySelector('.categories');
    const categories = getCategories();

    categorySection.innerHTML = ''; // Clear existing buttons
    categories.forEach(category => {
        const categoryButton = `<button class="category-btn" data-category="${category}">${category}</button>`;
        categorySection.innerHTML += categoryButton;
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', filterByCategory);
    });
}

// Function to display items on the page
function displayItems(items) {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = ''; // Clear current items
    items.forEach(item => {
        const productCard = `
            <div class="product-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                <button class="edit-item-btn" data-id="${item.id}">Edit</button>
                <button class="remove-item-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        productList.innerHTML += productCard;
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    document.querySelectorAll('.edit-item-btn').forEach(button => {
        button.addEventListener('click', editItem);
    });
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Function to remove an item
function removeItem(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const index = groceryList.findIndex(item => item.id === itemId);

    if (index !== -1) {
        groceryList.splice(index, 1); // Remove the item from the grocery list
        saveGroceryList(); // Save the updated list
        displayItems(groceryList); // Refresh the display
        alert('Item removed successfully!');
    }
}

// Function to add items to the cart
function addToCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = groceryList.find(product => product.id === itemId);
    const cartItem = cart.find(cartItem => cartItem.id === itemId);

    if (cartItem) {
        cartItem.quantity += 1; // Increase quantity if item is already in cart
    } else {
        cart.push({ ...item, quantity: 1 }); // Add new item to the cart
    }
    alert(`${item.name} added to the cart!`);
}

// Function to display cart items
function viewCart() {
    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = ''; // Clear current cart items

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `;
        cartList.innerHTML += cartItem;
    });
}

// Function to filter items by category
function filterByCategory(e) {
    const category = e.target.getAttribute('data-category');
    if (category === 'All') {
        displayItems(groceryList); // Show all items if 'All' is selected
    } else {
        const filteredItems = groceryList.filter(item => item.category === category);
        displayItems(filteredItems);
    }
}

// Function to open the modal
function openModal() {
    populateCategoryDropdown(); // Populate categories when opening modal
    document.getElementById('item-modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    clearModalForm();
    document.getElementById('item-modal').style.display = 'none';
}

// Function to clear the modal form after closing
function clearModalForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-category').value = '';
    document.getElementById('item-image').value = '';
    document.getElementById('add-item-form').removeAttribute('data-edit-id'); // Clear the edit ID
}

// Function to populate category dropdown in the modal
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('item-category');
    const categories = getCategories();

    categorySelect.innerHTML = ''; // Clear existing options
    categories.forEach(category => {
        const option = `<option value="${category}">${category}</option>`;
        categorySelect.innerHTML += option;
    });
}

// Function to handle the form submission for adding or updating an item
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const imageInput = document.getElementById('item-image');

    // Ensure values are provided and valid
    if (!name || isNaN(price) || !category) {
        alert('Please enter valid item details.');
        return;
    }

    const editId = document.getElementById('add-item-form').getAttribute('data-edit-id');

    if (editId) {
        // Updating an existing item
        const itemId = parseInt(editId);
        const updatedItem = groceryList.find(item => item.id === itemId);
        updatedItem.name = name;
        updatedItem.price = price;
        updatedItem.category = category;

        // Update image if a new one is uploaded
        if (imageInput.files.length) {
            const reader = new FileReader();
            reader.onload = function(event) {
                updatedItem.imageUrl = event.target.result; // Update with new image
                saveGroceryList(); // Save updated list
                displayItems(groceryList); // Refresh the display
                closeModal(); // Close the modal
            };
            reader.readAsDataURL(imageInput.files[0]); // Read the image file
        } else {
            saveGroceryList(); // Save updated list without changing image
            displayItems(groceryList); // Refresh the display
            closeModal(); // Close the modal
        }
    } else {
        // Adding a new item
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;

            const newItem = {
                id: groceryList.length + 1,
                name: name,
                price: price,
                category: category,
                imageUrl: imageUrl,
            };

            groceryList.push(newItem); // Add new item to list
            saveGroceryList(); // Save new item
            displayItems(groceryList); // Refresh the display
            displayCategories(); // Refresh category buttons
            alert(`${newItem.name} added to the grocery list!`);

            closeModal(); // Close the modal after adding the item
        };

        reader.readAsDataURL(imageInput.files[0]); // Read the image file
    }
}

// Function to search for items
function searchItems() {
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const filteredItems = groceryList.filter(item => item.name.toLowerCase().includes(searchTerm));
    displayItems(filteredItems); // Display the filtered items
}

// Load grocery list on page load
window.onload = function() {
    groceryList = loadGroceryList(); // Load from localStorage
    displayItems(groceryList); // Display loaded items
    displayCategories(); // Display categories
};


// Function to sort items
function sortItems() {
    const sortOption = document.getElementById('sort-options').value;

    let sortedItems = [...groceryList];
    if (sortOption === 'category') {
        sortedItems.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === 'price') {
        sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'name') {
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayItems(sortedItems);
}

// Function to edit an item
function editItem(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = groceryList.find(product => product.id === itemId);

    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-category').value = item.category;

    // Set a flag indicating we are editing an item
    document.getElementById('add-item-form').setAttribute('data-edit-id', itemId);
    document.getElementById('modal-title').innerText = 'Edit Item'; // Optional: set a title for the modal
    openModal();
}

// Logout button functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('currentUser'); // Clear current user data
    window.location.href = 'login.html'; // Redirect to login page
});

// Event listeners
document.getElementById('search-btn').addEventListener('click', searchItems);
document.getElementById('sort-options').addEventListener('change', sortItems);
document.querySelector('.add-item-btn').addEventListener('click', openModal);
document.querySelector('.view-cart-btn').addEventListener('click', viewCart);
document.getElementById('cart-btn').addEventListener('click', viewCart);

// Modal event listeners
document.querySelector('.close-btn').addEventListener('click', closeModal);
document.getElementById('add-item-form').addEventListener('submit', handleFormSubmit);

// Initial display of items and categories
displayItems(groceryList);
displayCategories();
