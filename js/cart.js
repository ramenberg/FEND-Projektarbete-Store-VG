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
		// Funktion för att räkna ut totala summan av en artikel
		function totalSumOfProduct() {
			let totalSumOfProduct = 0;
			totalSumOfProduct = (product.price * product.quantity).toFixed(2);
			return totalSumOfProduct;
		}
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

		// Funktion för att tömma varukorgen
		function emptyCart() {
			localStorage.removeItem('fs-cart');
			window.location.href = 'cart.html';
		}
		// Körs i cart.html
		if ($('#cart-items').length) {
			// Pre info
			let preInfo = `
        	<span class="text-muted">${cart.length} artiklar</span>
        	`;
			$('.cart-item-number').html(preInfo);

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
						emptyCart();
					} else {
						window.location.reload();
					}
				});

				// Funktion för att ta bort en vara helt
				$('#cart-items').on('click', '.remove-item', function (e) {
					e.preventDefault();
					let productId = $(this).closest('.cart-item').data('product-id');
					console.log(productId);

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
						emptyCart();
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
				emptyCart();
			});
			// Checkout
			$('#checkout-button').click(function (e) {
				e.preventDefault();
				window.location.href = 'order.html';
			});
		}
		// Körs i order.html och confirmation.hmtl
		else if ($('#cart-items-checkout').length) {
			console.log('Start kör');
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
			$('#cart-items-checkout').append(singleProduct);
			console.log('körs');
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
	}
}
