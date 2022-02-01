let shopParts_ar = [];
// Initial function
const init = () => {
    checkLocal();
    declareViewEvents();
    toggleEditMode(null);
    resetAllFormElements();
};
// Checks if you have pre-stored information in Locale-Storage, if so you retrieve it, then displays it
const checkLocal = () => {
    if (localStorage.getItem("shopParts")) {
        shopParts_ar = JSON.parse(localStorage.getItem("shopParts"));
        renderAndSaveShoppingCart(shopParts_ar);
    };
};
// function that calls all the elements
function getAllFormElements() {
    return {
        id: document.querySelector("#editting-item-id"),
        select: document.querySelector("#id_select"),
        title: document.querySelector("#id_title"),
        description: document.querySelector("#id_description"),
        price: document.querySelector("#id_price"),
        pic: document.querySelector("#id_pic"),
        url: document.querySelector("#id_url")
    };
}
// Function for converting all form elements to an object Takes the value from all the inputs
function convertAllFormElementsToObject() {
    let shopPartsElements = getAllFormElements();
    const shopPartsObj = {};
    for (const key in shopPartsElements) {
        const htmlEl = shopPartsElements[key];
        shopPartsObj[key] = htmlEl.value;
    };
    return shopPartsObj;
}
// Function to reset all form fields
function resetAllFormElements() {
    let shopPartsElements = getAllFormElements();
    shopPartsElements.id.value = '';
    shopPartsElements.select.selectedIndex = 0;
    shopPartsElements.title.value = '';
    shopPartsElements.description.value = '';
    shopPartsElements.price.value = 1;
    shopPartsElements.pic.value = '';
    shopPartsElements.url.value = '';

};
// Function for checking all field fields
function validateAllFormElements() {
    let shopPartsElements = getAllFormElements();
    if (shopPartsElements.title.value.length < 2) {
        alert("הכנס כותרת תקינה");
        return false;
    };
    if (shopPartsElements.description.value.length < 2) {
        alert("הכנס תיאור  תקין")
        return false;
    };
    if (shopPartsElements.pic.value.length < 2) {
        alert("הכנס  כתבובות תמונה")
        return false;
    };
    if (shopPartsElements.url.value.length < 2) {
        alert("הכנס URL תקין")
        return false;
    };
    return true;
};

const declareViewEvents = () => {
    let reset_btn = document.querySelector("#reset_btn");
    let add_btn = document.querySelector("#add_btn");
    reset_btn.addEventListener("click", () => {
        shopParts_ar = [];
        renderAndSaveShoppingCart(shopParts_ar);
    });

    add_btn.addEventListener("click", () => {
        if (!validateAllFormElements()) {
            return;
        }
        const shopPartsObj = convertAllFormElementsToObject();
        shopPartsObj.id = Date.now();
        resetAllFormElements();
        // // Add a product to an array
        shopParts_ar.push(shopPartsObj);
        // Calls a function that renders the information in the array to the table
        renderAndSaveShoppingCart(shopParts_ar);
    });
};
// Function to start editing the product
function applyEdit() {
    const itemId = document.querySelector("#editting-item-id").value;
    for (const item of shopParts_ar) {
        if (item.id == itemId) {
            const updatedItem = convertAllFormElementsToObject();
            Object.assign(item, updatedItem);
            localStorage.setItem("shopParts", JSON.stringify(shopParts_ar));
            renderAndSaveShoppingCart(shopParts_ar);
            break;
        };
    };
    toggleEditMode(null);
};
// Function for replacing the Add Product Buttons with Product Edit Buttons
function toggleEditMode(item) {
    const editItemControls = document.getElementById('edit-item-controls');
    const newItemControls = document.getElementById('new-item-controls');
    if (!item) {
        newItemControls.classList.remove('hid');
        editItemControls.classList.add('hid');
    } else {
        newItemControls.classList.add('hid');
        editItemControls.classList.remove('hid');
    };

    if (item) {
        const elements = getAllFormElements();
        for (const key in elements) {
            const element = elements[key];
            element.value = item[key];
        }
    } else {
        resetAllFormElements();
    };
};
// Marender and also at the end after displaying the table saves the information in the array
const renderAndSaveShoppingCart = (_ar) => {
    // Prevents duplication and prints according to the locale
    document.querySelector("#id_tbody").innerHTML = "";
    _ar.forEach((item, i) => {
        let newTr = document.createElement("tr");
        document.querySelector("#id_tbody").append(newTr);
        const deleteButtonId = `delete-button-${item.id}`;
        const editButtonId = `edit-button-${item.id}`;
        newTr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.select}</td>
      <td>${item.title}</td>
      <td>${item.description}</td>
      <td>${item.price}</td>
      <td><img src="${item.pic}" height="160" width="286" alt="${item.pic} class="card-img-top "></td>
      <td><a class="btn btn-dark" href="${item.url}" target="_blank">View product</a></td>
      <td>
        <a id="${deleteButtonId}" class="btn btn-danger">Delete</a>
      </td>
      <td>
      <a id="${editButtonId}" class="btn btn-warning">Edit</a>
    </td>
    `
        document.querySelector(`#${deleteButtonId}`).addEventListener("click", () => {
            delSingleStudent(item.id)
        });

        document.querySelector(`#${editButtonId}`).addEventListener("click", () => {
            toggleEditMode(item);
        });
    });
    //Save or delete by calling a function Enter the source of the students as a parameter.
    renderCartSubtotal(shopParts_ar);
    localStorage.setItem("shopParts", JSON.stringify(_ar));
};
// Function for calculating the total amount in the cart and calculating the number of products in the cart
const renderCartSubtotal = (_ar) => {
    const amountOfItems = _ar.length;
    document.querySelector("#id_shopParts_length").innerHTML = `${amountOfItems} Items`;
    let totalAllPrice = 0;
    _ar.forEach(item => {
        totalAllPrice += Number(item.price);
    });
    document.querySelector("#id_sum_Price").innerHTML = totalAllPrice + " ILS";
};
// Function that deletes a specific product according to its ID
const delSingleStudent = (_id) => {
    // confirm -> Opens a confirmation or cancellation pop-up
    if (confirm("האם אתה בטוח שתרצה למחוק?")) {
        shopParts_ar.forEach((item, i) => {
            if (item.id == _id) {
                shopParts_ar.splice(i, 1);
            };
        });
        // Rendering again and Brandor has a command that keeps in Local Storage
        renderAndSaveShoppingCart(shopParts_ar);
    };
};
// A call to the initial function in which I called all the other functions
init();