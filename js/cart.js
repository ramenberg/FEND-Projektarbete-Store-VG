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
		// Pre info
		let preInfo = `
        <span class="text-muted">${cart.length} varor</span>
        `;
		$('.cart-item-number').html(preInfo);
		// Loopa igenom varukorgen och skriv ut varje produkt
		let singleProduct = '';
		cart.forEach(function (product) {
			singleProduct += `
            
            <div class="row border-bottom">
                <div class="col w-100 d-flex justify-content-between">
                    <div class="row main w-100 py-2 px-1">
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
                                <span class="col-1 text-right"><a href="#" title="Ta bort vara"><span class="text-danger remove-item">&#10005;</span></a></span>
                            </div>
                            <!-- Quantity -->
                            <div class="row">
                                <div class="col cart-content-info d-flex justify-content-between align-items-baseline">
                                    <span class="col single-price text-muted">${product.price.toFixed(
																			2
																		)} kr / st</span>
                                    <div class="col-3 cart-quantity-buttons m-2 w-15">
                                    <span class="col">
                                        <input
                                            type="number"
                                            class="form-control border-0"
                                            id="cart_quantity"
                                            value="${product.quantity}"
                                            min="0"
                                            max="20"
                                            placeholder="antal_av_varan"
                                            name="cart_quantity" />
                                            
                                    </span>
                                    <!-- Uppdatera antal -->
                                    <a href="#" class="update-quantity" title="Uppdatera antal"><span class="text-center">&#11118;</span></a>
                                    </div>
                                    <span class="col-2 text-bold text-right">${(
																			product.price * product.quantity
																		).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Totalpris för varan beroende på antal-->
                    </div>
                </div>
            </div>
            `;
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
		});
		// TODO funktion för att räkna ut totala summan
		$('#cart-items').append(singleProduct);
		// Slut på varukorgsloop
		// Summeringsinfo
		let summaryInfo = `
            <div class="px-1 mx-2">
                <div class="row align-items-baseline">
                    <div class="col">
                        <h5 class="text-bold">Summering</h5>
                    </div>
                    <div class="col text-end float-end">
                        <p class="text-bold text-right">${totalItems} varor</p>
                    </div>
                </div>
                <div class="row pb-3 border-top">
                    <div class="col">Totalpris</div>
                    <div class="col text-right">${cartSum.toFixed(2)} kr</div>
                </div>
                <div class="row d-grid gap-4">
                    <button class="btn btn-primary mb-1" type="button" id="checkout-button">Fortsätt till beställning</button>
                    <button class="btn btn-outline-danger mb-1" type="button" id="empty-cart-button">Töm varukorg</button>
                </div>
            </div>
            `;
		$('.summary').html(summaryInfo);
	}
}
