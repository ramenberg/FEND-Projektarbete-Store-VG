'use strict';
// Produkter för index.html.
function renderProducts() {
	$.getJSON('https://fakestoreapi.com/products')
		.done(function (products) {
			let productItem = $.map(products, function (product) {
				return `
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">${product.price} kr</p>
                            <a href="#" class="btn btn-primary viewProduct" data-product-id="${product.id}">Visa produkt</a>
                        </div>
                    </div>
                </div>
                `;
			});
			$('#produkter').html(productItem);
			$('.viewProduct').click(function (e) {
				e.preventDefault();
				const productId = $(this).data('product-id');
				sessionStorage.setItem('productId', productId);
				window.location.href = 'product.html';
			});
		})
		.fail(function (error) {
			console.log(error);
		});
}

// Singelprodukt för product.html.
function renderSingleProduct() {
	const productId = sessionStorage.getItem('productId');
	$.getJSON('https://fakestoreapi.com/products/' + productId)
		.done(function (product) {
			const chosenProduct = {
				id: product.id,
				title: product.title,
				price: product.price,
				description: product.description,
				category: product.category,
				image: product.image,
				rating: product.rating,
				quantity: 0,
			};
			if ($('#single-product-info').length) {
				let productItemAllInfo = `
        <div class="container my-5">
            <div class="row">
                <div class="col-md-5">
                    <div class="product-img">
                        <img class="img-fluid" src="${product.image}" alt="ProductS">
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="product-description px-2">
                        <div class="category text-bold text-uppercase text-primary">
                            Kategori: ${product.category}
                        </div>
                        <div class="product-title text-bold my-3">
                            ${product.title}
                        </div>


                        <div class="price-area my-4">
                            <p class="new-price text-bold mb-1">${product.price} kr</p>
                        </div>


                        <div class="buttons d-flex my-5">
                            <div class="block">
                                <button class="btn btn-primary" id="addToCartBtn">Lägg i varukorg</button>
                            </div>

                            <div class="block quantity">
                                <input type="number" class="form-control" id="cart_quantity" value="1" min="0" max="20" placeholder="antal_av_varan" name="cart_quantity">
                            </div>
                        </div>
                    </div>

                    <div class="product-details my-4">
                        <p class="details-title text-color mb-1">Om produkten</p>
                        <p class="description">${product.description}</p>
                    </div>
                    <div class="product-details my-4">
                        <p class="details-title text-color mb-2">Betyg och omdömen</p>
                        <ul>
                            <li>Våra kunders betyg: ${product.rating.rate}</li>
                            <li>Antal omdömen: ${product.rating.count}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
				$('#single-product-info').html(productItemAllInfo);

				$('#addToCartBtn').click(function (e) {
					e.preventDefault();
					if ($('#cart_quantity').val() > 0) {
						// Kontrollera om det finns en varukorg i localstorage
						if (localStorage.getItem('fs-cart') === null) {
							// Om inte, skapa en tom array
							let cart = [];
							// lägger till antal av produkten i varukorgen
							chosenProduct.quantity = Number($('#cart_quantity').val());
							// Pusha den valda produkten till arrayen
							cart.push(chosenProduct);
							// Spara arrayen i localstorage
							localStorage.setItem('fs-cart', JSON.stringify(cart));
						} else {
							// Om det finns en varukorg i localstorage, hämta den
							let cart = JSON.parse(localStorage.getItem('fs-cart'));
							// kontrollera om produkten redan finns i varukorgen
							let productExists = false;
							for (let i = 0; i < cart.length; i++) {
								if (cart[i].id === chosenProduct.id) {
									// Om produkten finns, lägg till antal av produkten i varukorgen
									cart[i].quantity += Number($('#cart_quantity').val());
									productExists = true;
								}
							}
							// Om produkten inte finns i varukorgen, lägg till den
							if (!productExists) {
								chosenProduct.quantity = Number($('#cart_quantity').val());
								cart.push(chosenProduct);
							}
							// Spara arrayen i localstorage
							localStorage.setItem('fs-cart', JSON.stringify(cart));
						}
						window.location.href = 'cart.html';
					} else {
					}
				});
			}
		})
		.fail(function (error) {
			console.log(error);
		});
}

// Visa produkter i cart.
function renderCartProducts() {
	const cartItems = localStorage.getItem('fs-cart');

	if (!cartItems || cartItems.length === 0) {
		console.log('Varukorgen är tom');
		let emptyCart = `
        <div class="col-12 my-5">
            <h2 class="text-center">Här var det tomt!</h2>
            <p class="text-center text-bold"><a href="index.html">Fortsätt handla</a></p>
        </div>
    `;
		$('.before-cart').html(emptyCart);
	} else {
		const cart = JSON.parse(cartItems);

		if (cart.length === 0) {
			console.log('Varukorgen är tom');
		} else {
			let cartSum = 0;
			let totalItems = 0;

			// funktion för att räkna ut totala summan av varukorgen
			function totalSum() {
				let totalSum = 0;
				for (let i = 0; i < cart.length; i++) {
					totalSum += cart[i].price * cart[i].quantity;
				}
				return totalSum;
			}
			cartSum = totalSum();

			function totalItemsInCart() {
				let totalItems = 0;
				for (let i = 0; i < cart.length; i++) {
					totalItems += cart[i].quantity;
				}
				return totalItems;
			}
			totalItems = totalItemsInCart();

			// Körs i cart.html
			if ($('#cart-items').length) {
				renderCart(cart, cartSum, totalItems);
			}
			// Körs i order.html och confirmation.hmtl
			else if ($('#cart-items-checkout').length) {
				renderCartCheckout(cart, cartSum, totalItems);
			}
		}
	}
}

// Validering av beställningsformulär.
function validateForm() {
	$('form').on('submit', function (event) {
		event.preventDefault();

		//Postnummer ska ha fem siffror i format 000 00. Användaren kan skicka in fem siffor med ett mellarum. Nedan tar bort allt som inte är en siffra.
		const postalCode = $('#postalCode').val().replace(/\D/g, '');

		//Delar upp siffrorna 00000 och lägger in mellanrum på rätt ställe 000 00
		const postalCodeFormatted = `${postalCode.slice(0, 3)} ${postalCode.slice(
			3
		)}`;

		console.log(postalCodeFormatted);

		//lägg alla formulärfält i en variabel som tar emot användarens input
		const input = {
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val(),
			phone: $('#phone').val(),
			email: $('#email').val(),
			address: $('#address').val(),
			postalCode: postalCodeFormatted,
			city: $('#city').val(),
			country: $('#country').val(),
		};

		// variabel för att hålla koll på om alla fält är validerade
		let isValid = true;

		// Validera förnamn
		if (input.firstName.length < 2 || input.firstName.length > 50) {
			$('#firstName').addClass('is-invalid');
			isValid = false;
		} else {
			$('#firstName').removeClass('is-invalid');
		}

		// Validera efternamn
		if (input.lastName.length < 2 || input.lastName.length > 50) {
			$('#lastName').addClass('is-invalid');
			isValid = false;
		} else {
			$('#lastName').removeClass('is-invalid');
		}

		//validerar mobilnr. Det får endast innehålla siffror, bindestreck och parenteser. Max 50 tecken
		const phoneRegex = /^[\d()-]{1,50}$/;
		if (!phoneRegex.test(input.phone)) {
			$('#phone').addClass('is-invalid');
			isValid = false;
		} else {
			$('#phone').removeClass('is-invalid');
		}

		// Validera email
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(input.email) || input.email.length > 50) {
			$('#email').addClass('is-invalid');
			isValid = false;
		} else {
			$('#email').removeClass('is-invalid');
		}

		// Validera address
		if (input.address.length < 2 || input.address.length > 50) {
			$('#address').addClass('is-invalid');
			isValid = false;
		} else {
			$('#address').removeClass('is-invalid');
		}

		// Validera ort
		if (input.city.length < 2 || input.city.length > 50) {
			$('#city').addClass('is-invalid');
			isValid = false;
		} else {
			$('#city').removeClass('is-invalid');
		}

		// Validera postnummer
		const postalCodeRegex = /^\d{3}\s?\d{2}$/;
		if (!postalCodeRegex.test(input.postalCode)) {
			$('#postalCode').addClass('is-invalid');
			isValid = false;
		} else {
			$('#postalCode').removeClass('is-invalid');
		}

		// Om alla fält är validerade, godkänn formuläret och spara i sessionstorage
		if (isValid) {
			sessionStorage.setItem('customerInfo', JSON.stringify(input));

			this.submit();
			window.location.href = 'confirmation.html';
		}
	});
}
// Körs på confirmation för att hämta produkter, kundinfo och sedan tömma varukorgen.
function renderConfirmation() {
	$(document).ready(function () {
		renderConfirmationProducts();
		renderCustomerInformation();
		emptyCartNonReload();
	});
}
// Visar beställda produkter på bekräftelsesidan.
function renderConfirmationProducts() {
	const cartItems = localStorage.getItem('fs-cart');

	if (!cartItems || cartItems.length === 0) {
		console.log('Varukorgen är tom');
		let emptyCart = `
        <div class="col-12 my-5">
            <h2 class="text-center">Här var det tomt!</h2>
            <p class="text-center text-bold"><a href="index.html">Fortsätt handla</a></p>
        </div>
    `;
		$('.before-cart').html(emptyCart);
	} else {
		const cart = JSON.parse(cartItems);

		if (cart.length === 0) {
			console.log('Varukorgen är tom');
		} else {
			let cartSum = 0;
			let totalItems = 0;

			// funktion för att räkna ut totala summan av varukorgen
			function totalSum() {
				let totalSum = 0;
				for (let i = 0; i < cart.length; i++) {
					totalSum += cart[i].price * cart[i].quantity;
				}
				return totalSum;
			}
			cartSum = totalSum();

			function totalItemsInCart() {
				let totalItems = 0;
				for (let i = 0; i < cart.length; i++) {
					totalItems += cart[i].quantity;
				}
				return totalItems;
			}
			totalItems = totalItemsInCart();

			if ($('#confirmed-items').length) {
				// Pre info
				let preInfo = `
			<div class="col-7 cart-item-name text-bold">Produkt</div>
			<div class="cart-item-quantity text-bold">Antal</div>
			<div class="cart-item-price text-bold">Pris</div>
			`;
				$('.pre-info').append(preInfo);
				// Loopa igenom varukorgen och skriv ut varje produkt
				let singleProduct = '';
				cart.forEach(function (product) {
					singleProduct += `
            
            <div class="row border-bottom cart-item" data-product-id="${
							product.id
						}">

                <div class="col w-100 d-flex justify-content-between px-3">
                    <div class="row main w-100 py-2 px-3">
                        <!-- Image -->
                        <div class="col cart-image d-block">
                            <img class="img-fluid" src="${product.image}" />
                        </div>
                        <!-- Title -->
                        <div class="cart-content col px-0">
                            <!-- Quantity -->
                            <div class="row">
                                <div class="col cart-content-info d-flex justify-content-between align-items-baseline">
								<div class="col">
									<span class="row cart-item-title px-2">${product.title}</span>
                                    <span class="row single-price text-muted px-2 pt-1">${product.price.toFixed(
																			2
																		)} kr / st</span>
								</div>
								
                                    <span class="text-center px-2">${
																			product.quantity
																		}</span>
                                    <span class="col-3 text-bold text-right">${(
																			product.price * product.quantity
																		).toFixed(2)} kr
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Totalpris för varan beroende på antal-->
                    </div>
                </div>
            </div>
			
            `;
				});
				$('#confirmed-items').append(singleProduct);
				// Summeringsinfo
				let summaryInfo = `
            <div class="pt-5 mx-2">
                <div class="row align-items-baseline">
                    <div class="col">
                        <p>Totalt</p>
                    </div>
                    <div class="col text-end float-end">
                        <p class="text-right">${totalItems} varor</p>
                    </div>
                </div>
                <div class="row pb-3 border-top">
                    <div class="col text-bold">Summa</div>
                    <div class="col text-right text-bold">${cartSum.toFixed(
											2
										)} kr</div>
                </div>
            </div>
            `;

				$('.summary').append(summaryInfo);
			}
		}
	}
}

// Visar alla produkter i varukorgen.
function renderCart(cartArray, cartSum, totalItems) {
	let cart = cartArray;
	cartSum = cartSum;
	totalItems = totalItems;
	// Pre info
	let preInfo = `
    <span class="text-muted">${cart.length} artiklar</span>
    `;
	$('.cart-item-number').html(preInfo);

	// Loopa igenom varukorgen och skriv ut varje produkt
	let singleProduct = '';
	cart.forEach(function (product) {
		singleProduct += `
    
    <div class="row border-bottom cart-item" data-product-id="${product.id}">

        <div class="col w-100 d-flex justify-content-between px-3">
            <div class="row main w-100 py-2 px-3">
                <!-- Image -->
                <div class="col cart-image d-block">
                    <img class="img-fluid" src="${product.image}" />
                </div>
                <!-- Title -->
                <div class="cart-content col px-0">
                    <div class="col cart-content-info d-flex justify-content-between align-items-baseline">
                        <span class="col cart-item-title">${
													product.title
												}</span>
                        <!-- Kryss/ta bort -->
                        <a href="#" title="Ta bort vara" class="remove-item">
                            <span class="text-danger text-right">&#10005;</span>
                        </a>
                    </div>
                    <!-- Quantity -->
                    <div class="row">
                        <div class="col cart-content-info d-flex justify-content-between align-items-baseline">
                            <span class="col single-price text-muted">${product.price.toFixed(
															2
														)} kr / st</span>
                            <div class="col-3 cart-quantity-buttons m-2">
                                <span class="col">
                                    <input
                                        type="number"
                                        class="form-control border-0 cart-quantity-input"
                                        id="cart_quantity_${product.id}"
                                        value="${product.quantity}"
                                        min="0"
                                        max="20"
                                        placeholder="antal_av_varan"
                                        name="cart_quantity" />
                                        
                                </span>
                                <!-- Uppdatera antal -->
                                <a href="#" class="update-quantity" title="Uppdatera antal" data-input-id="cart_quantity_${
																	product.id
																}"><span class="text-center">&#11118;</span></a>
                            </div>
                            <span class="col-3 text-bold text-right">${(
															product.price * product.quantity
														).toFixed(2)} kr
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Totalpris för varan beroende på antal-->
            </div>
        </div>
    </div>
    `;

		$('#cart-items').html(singleProduct);
		// Funktion för att uppdatera antal
		$('#cart-items').on('click', '.update-quantity', function (e) {
			e.preventDefault();

			let productId = $(this).closest('.cart-item').data('product-id');

			// Quantity
			let newQuantity = $(this).data('input-id');
			newQuantity = parseInt($('#' + newQuantity).val());

			for (let i = 0; i < cart.length; i++) {
				if (cart[i].id === productId) {
					const index = cart.indexOf(cart[i]);
					// Tar bort produkten om antalet är 0 eller lägre
					if (newQuantity === 0) {
						cart.splice(index, 1);
					} else {
						cart[i].quantity = newQuantity;
					}
				}
			}

			localStorage.setItem('fs-cart', JSON.stringify(cart));
			if (cart.length === 0) {
				emptyCartReload();
			} else {
				window.location.reload();
			}
		});

		// Funktion för att ta bort en vara helt
		$('#cart-items').on('click', '.remove-item', function (e) {
			e.preventDefault();
			let productId = $(this).closest('.cart-item').data('product-id');

			for (let i = 0; i < cart.length; i++) {
				if (cart[i].id === productId) {
					const index = cart.indexOf(cart[i]);
					cart.splice(index, 1);
				} else {
					console.log('Det fanns ingen vara med det id.');
				}
			}

			localStorage.setItem('fs-cart', JSON.stringify(cart));
			if (cart.length === 0) {
				emptyCartReload();
			} else {
				window.location.reload();
			}
		});
	});

	// Slut på varukorgsloop

	// Summeringsinfo
	let summaryInfo = `
    <div class="px-1 mx-2">
        <div class="row align-items-baseline">
        <div class="col">
            <p>Totalt</p>
        </div>
        <div class="col text-end float-end">
            <p class="text-right">${totalItems} varor</p>
        </div>
        </div>
        <div class="row pb-3 border-top">
            <div class="col text-bold">Summa</div>
            <div class="col text-right text-bold">${cartSum.toFixed(2)} kr</div>
        </div>
        <div class="row d-grid gap-4">
            <button class="btn btn-primary mb-1" type="button" id="checkout-button">Fortsätt till beställning</button>
            <button class="btn btn-outline-danger mb-1" type="button" id="empty-cart-button">Töm varukorg</button>
        </div>
    </div>
    `;

	$('.summary').html(summaryInfo);
	// Töm varukorg
	$('#empty-cart-button').click(function (e) {
		e.preventDefault();
		emptyCartReload();
	});
	// Checkout
	$('#checkout-button').click(function (e) {
		e.preventDefault();
		window.location.href = 'order.html';
	});
}

// Visar produkterna på beställningssidan
function renderCartCheckout(cartArray, cartSum, totalItems) {
	let cart = cartArray;
	cartSum = cartSum;
	totalItems = totalItems;
	// Pre info
	let preInfo = `
        <div class="col-7 cart-item-name text-bold">Produkt</div>
        <div class="cart-item-quantity text-bold">Antal</div>
        <div class="cart-item-price text-bold">Pris</div>
        `;
	$('.cart-pre-info').append(preInfo);
	// Loopa igenom varukorgen och skriv ut varje produkt
	let singleProduct = '';
	cart.forEach(function (product) {
		singleProduct += `
        
        <div class="row border-bottom cart-item" data-product-id="${
					product.id
				}">

            <div class="col w-100 d-flex justify-content-between px-3">
                <div class="row main w-100 py-2 px-3">
                    <!-- Image -->
                    <div class="col cart-image d-block">
                        <img class="img-fluid" src="${product.image}" />
                    </div>
                    <!-- Title -->
                    <div class="cart-content col px-0">
                        <!-- Quantity -->
                        <div class="row">
                            <div class="col cart-content-info d-flex justify-content-between align-items-baseline">
                            <div class="col">
                                <span class="row cart-item-title px-2">${
																	product.title
																}</span>
                                <span class="row single-price text-muted px-2 pt-1">${product.price.toFixed(
																	2
																)} kr / st</span>
                            </div>
                            
                                <span class="text-center px-2">${
																	product.quantity
																}</span>
                                <span class="col-3 text-bold text-right">${(
																	product.price * product.quantity
																).toFixed(2)} kr
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- Totalpris för varan beroende på antal-->
                </div>
            </div>
        </div>
        
        `;
	});
	$('#cart-items-checkout').append(singleProduct);

	// Summeringsinfo
	let summaryInfo = `
        <div class="pt-5 mx-2">
            <div class="row align-items-baseline">
                <div class="col">
                    <p>Totalt</p>
                </div>
                <div class="col text-end float-end">
                    <p class="text-right">${totalItems} varor</p>
                </div>
            </div>
            <div class="row pb-3 border-top">
                <div class="col text-bold">Summa</div>
                <div class="col text-right text-bold">${cartSum.toFixed(
									2
								)} kr</div>
            </div>
            <div class="row d-grid gap-4">
                <button class="btn btn-outline-primary mb-1" type="button" id="back-to-cart-button">Tillbaka till varukorgen</button>
                <button class="btn btn-outline-primary mb-1" type="button" id="keep-shopping-button">Fortsätt handla</button>
            </div>
        </div>
        `;

	$('.summary').append(summaryInfo);

	// Tillbaka till varukorgsknapp
	$('#back-to-cart-button').click(function (e) {
		e.preventDefault();
		window.location.href = 'cart.html';
	});
	// Fortsätt handla-knapp
	$('#keep-shopping-button').click(function (e) {
		e.preventDefault();
		window.location.href = 'index.html';
	});
}

// Skapar kundinfo för bekräftelsesidan
function renderCustomerInformation() {
	const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo'));

	function showCustomerInfo(customer) {
		const container = $('#confirmation-customer-info');
		container.html(`
            <div class="row d-flex justify-content-between">
                <div class="col-md-12 ps-5">
                    <small class="text-muted">Adress:</small>
                    <p>${customer.firstName} ${customer.lastName}<br>
                    ${customer.address}<br>
                    ${customer.postalCode} ${customer.city}<br>
                    ${customer.country}</p>
                </div>
                <div>
                    <small class="text-muted">E-mail:</small>
                    <p>${customer.email}</p>
                    <small class="text-muted">Telefon:</small>
                    <p>${customer.phone}</p>
                </div>
            </div>
            `);
	}
	if ($(customerInfo).length) {
		showCustomerInfo(customerInfo);
	} else {
		console.log('Ingen kund vald eller sessionStorage är tom.');
	}
}

// Div mindre funktioner

// Funktion för att tömma varukorgen
function emptyCartReload() {
	localStorage.removeItem('fs-cart');
	window.location.reload();
}
// Utan reload.
function emptyCartNonReload() {
	localStorage.removeItem('fs-cart');
}
