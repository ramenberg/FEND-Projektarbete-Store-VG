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
