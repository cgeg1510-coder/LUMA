/* PRODUCTOS DE LUMA */

const baseProducts = [

    {
        id: 1,
        name: "Nike Air Force 1",
        price: 2000,
        category: "Tenis",
        condition: "Nuevo",
        icon: "👟"
    },

    {
        id: 2,
        name: "Bolsa Coach",
        price: 3500,
        category: "Bolsas",
        condition: "Usado",
        icon: "👜"
    },

    {
        id: 3,
        name: "Sudadera Zara",
        price: 800,
        category: "Ropa",
        condition: "Nuevo",
        icon: "🧥"
    },

    {
        id: 4,
        name: "Adidas Samba",
        price: 1800,
        category: "Tenis",
        condition: "Usado",
        icon: "👟"
    },

    {
        id: 5,
        name: "Playera básica",
        price: 500,
        category: "Ropa",
        condition: "Nuevo",
        icon: "👕"
    },

    {
        id: 6,
        name: "Gorra New Era",
        price: 700,
        category: "Accesorios",
        condition: "Usado",
        icon: "🧢"
    },

    {
        id: 7,
        name: "Jeans Levi's",
        price: 1100,
        category: "Ropa",
        condition: "Usado",
        icon: "👖"
    },

    {
        id: 8,
        name: "Lentes de sol",
        price: 900,
        category: "Accesorios",
        condition: "Nuevo",
        icon: "🕶️"
    },

    {
        id: 9,
        name: "Bolsa minimalista",
        price: 1400,
        category: "Bolsas",
        condition: "Nuevo",
        icon: "👜"
    }

];


/* PRODUCTOS CREADOS POR USUARIOS */

function getUserProducts() {

    return JSON.parse(
        localStorage.getItem("lumaProducts") || "[]"
    );

}


function getProducts() {

    return [
        ...getUserProducts(),
        ...baseProducts
    ];

}


/* CARRITO */

function getCart() {

    return JSON.parse(
        localStorage.getItem("lumaCart") || "[]"
    );

}


function saveCart(cart) {

    localStorage.setItem(
        "lumaCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function money(number) {

    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* CONTADOR DEL CARRITO */

function updateCartCount() {

    const count =
        getCart().reduce(
            (total, item) =>
                total + item.qty,
            0
        );


    document
        .querySelectorAll("#cartCount")
        .forEach(element => {

            element.textContent = count;

        });

}


/* TARJETA DE PRODUCTO */

function productCard(product) {

    return `

    <div class="col-12 col-sm-6 col-lg-3">

        <article class="product-card">

            <div class="product-image">

                ${
                    product.image

                    ?

                    `<img
                        src="${product.image}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                    >`

                    :

                    product.icon
                }

            </div>


            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <div class="price">
                    ${money(product.price)}
                </div>


                <span class="badge-condition">
                    ${product.condition}
                </span>


                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})">

                    Agregar al carrito

                </button>

            </div>

        </article>

    </div>

    `;

}


/* SEGURIDAD PARA TEXTOS */

function escapeHTML(text) {

    return String(text).replace(
        /[&<>"']/g,

        function(match) {

            return {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[match];

        }

    );

}


/* AGREGAR AL CARRITO */

function addToCart(id) {

    const product =
        getProducts().find(
            product => product.id === id
        );


    if (!product) return;


    const cart = getCart();


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }


    saveCart(cart);


    alert(
        `${product.name} se agregó al carrito.`
    );

}


/* PRODUCTOS DESTACADOS */

function renderFeatured() {

    const container =
        document.getElementById(
            "featuredProducts"
        );


    if (!container) return;


    container.innerHTML =
        getProducts()
        .slice(0,4)
        .map(productCard)
        .join("");

}


/* CATEGORIAS */

let activeCategory = "Todos";


function filterCategory(category) {

    activeCategory = category;


    const title =
        document.getElementById(
            "categoryTitle"
        );


    if (title) {

        title.textContent =
            category === "Todos"
            ? "Todos los productos"
            : category;

    }


    renderCategoryProducts();

}


function renderCategoryProducts() {

    const container =
        document.getElementById(
            "categoryProducts"
        );


    if (!container) return;


    const search =
        (
            document.getElementById(
                "searchProducts"
            )?.value || ""
        ).toLowerCase();


    const products =
        getProducts().filter(product => {

            const categoryMatch =
                activeCategory === "Todos" ||

                product.category === activeCategory ||

                product.condition === activeCategory;


            const searchMatch =
                product.name
                .toLowerCase()
                .includes(search);


            return categoryMatch && searchMatch;

        });


    if (products.length === 0) {

        container.innerHTML = `

            <div class="col-12">

                <div class="empty">

                    No encontramos productos
                    con esos filtros.

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        products
        .map(productCard)
        .join("");

}


/* CARRITO */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    const cart = getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Explora las categorías
                    y agrega algo que te guste.
                </p>

                <a
                    href="categorias.html"
                    class="btn-luma mt-3">

                    Explorar productos

                </a>

            </div>

        `;


        updateSummary(0);

        return;

    }


    container.innerHTML =

        cart.map(item => `

            <div class="cart-item">


                <div class="cart-thumb">

                    ${
                        item.image

                        ?

                        `<img
                            src="${item.image}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:9px;
                            "
                        >`

                        :

                        item.icon
                    }

                </div>


                <div>

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ${item.condition}
                        ·
                        ${money(item.price)}
                    </p>


                    <div class="mt-2">

                        <button
                            class="remove-btn"
                            onclick="changeQty(${item.id},-1)">

                            −

                        </button>


                        ${item.qty}


                        <button
                            class="remove-btn"
                            onclick="changeQty(${item.id},1)">

                            ＋

                        </button>

                    </div>

                </div>


                <strong>

                    ${money(
                        item.price * item.qty
                    )}

                </strong>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})">

                    Eliminar

                </button>

            </div>

        `).join("");


    updateSummary(

        cart.reduce(
            (total,item) =>
                total +
                item.price *
                item.qty,
            0
        )

    );

}


/* CAMBIAR CANTIDAD */

function changeQty(id, amount) {

    const cart = getCart();


    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) return;


    item.qty += amount;


    if (item.qty <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart(cart);

    renderCart();

}


/* ELIMINAR */

function removeFromCart(id) {

    const cart =
        getCart().filter(
            item => item.id !== id
        );


    saveCart(cart);

    renderCart();

}


/* RESUMEN */

function updateSummary(subtotal) {

    const shipping =
        subtotal > 0
        ? 99
        : 0;


    const total =
        subtotal +
        shipping;


    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    const shippingElement =
        document.getElementById(
            "shipping"
        );


    const totalElement =
        document.getElementById(
            "total"
        );


    if (subtotalElement)
        subtotalElement.textContent =
            money(subtotal);


    if (shippingElement)
        shippingElement.textContent =
            money(shipping);


    if (totalElement)
        totalElement.textContent =
            money(total);

}


/* PAGO */

function checkout() {

    if (getCart().length === 0) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    alert(
        "Demo de LUMA: aquí se conectaría el proceso de pago."
    );

}


/* PUBLICAR PRODUCTO */

function setupSell() {

    const form =
        document.getElementById(
            "sellForm"
        );


    if (!form) return;


    const input =
        document.getElementById(
            "productImage"
        );


    let imageData = "";


    input?.addEventListener(
        "change",
        function() {

            const file =
                input.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    imageData =
                        event.target.result;


                    const preview =
                        document.getElementById(
                            "imagePreview"
                        );


                    preview.src =
                        imageData;


                    preview.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const product = {

                id: Date.now(),

                name:
                    document.getElementById(
                        "productName"
                    ).value,

                price:
                    Number(
                        document.getElementById(
                            "productPrice"
                        ).value
                    ),

                category:
                    document.getElementById(
                        "productCategory"
                    ).value,

                condition:
                    document.querySelector(
                        'input[name="condition"]:checked'
                    ).value,

                description:
                    document.getElementById(
                        "productDescription"
                    ).value,

                image:
                    imageData,

                icon:
                    "👚"

            };


            const products =
                getUserProducts();


            products.unshift(product);


            localStorage.setItem(
                "lumaProducts",
                JSON.stringify(products)
            );


            alert(
                "¡Producto publicado en LUMA!"
            );


            form.reset();


            const preview =
                document.getElementById(
                    "imagePreview"
                );


            preview.style.display =
                "none";


            imageData = "";

        }
    );

}


/* INICIAR */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        renderFeatured();

        renderCategoryProducts();

        renderCart();

        setupSell();

    }
);