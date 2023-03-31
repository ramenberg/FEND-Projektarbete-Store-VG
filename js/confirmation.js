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
	let checkoutFinished = false;

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

		// Funktion för att ta bort varukorgen från localStorage
		function emptyCart() {
			localStorage.removeItem('fs-cart');
			console.log('Varukorgen är har tagits bort från localStorage');
		}
		function removeCustomerInfo() {
			sessionStorage.removeItem('fs-customer-info');
			console.log('Customer info har tagits bort från localStorage');
		}
		if ($('#confirmed-items').length) {
			// Pre info
			let preInfo = `
			<div class="col-7 cart-item-name text-bold">Produkt</div>
			<div class="cart-item-quantity text-bold">Antal</div>
			<div class="cart-item-price text-bold">Pris</div>
			`;
			$('.pre-info').append(preInfo);
			console.log('preinfo körs');
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
			console.log(cart.length);
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
            </div>
            `;

			$('.summary').append(summaryInfo);
			checkoutFinished = true;
		}
	}
	if (checkoutFinished === true) {
		console.log('checkoutFinished är true');
		emptyCart();
	} else {
		console.log('checkoutFinished är false');
	}
}