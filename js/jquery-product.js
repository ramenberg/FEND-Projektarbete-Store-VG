const productId = sessionStorage.getItem('productId');
$.getJSON('https://fakestoreapi.com/products/' + productId).done(function (
	product
) {
	const chosenProduct = {
		id: product.id,
		title: product.title,
		price: product.price,
		description: product.description,
		category: product.category,
		image: product.image,
		rating: product.rating,
	};
	if ($('#order-right-info').length) {
		// order-right på order.html
		let productItemMinimal = `
        <li class="list-group-item d-flex justify-content-between lh-condensed">
        <div>
            <h6 class="my-0">${product.title}</h6>
        </div>
        <span class="text-muted invisible">${product.price}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <strong>Totalsumma: </strong>
            <strong>${product.price} kr</strong>
        </li>
        `;

		$('#order-right-info').html(productItemMinimal);
	}
	// order-right på confirmation.html
	else if ($('#confirmation-order-right-info').length) {
		let productItemAllInfo = `
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <div class="ms-3"><strong>Produkt</strong></div>
                <div class="ms-3"><strong>Antal</strong></div>
            </div>
        </li>
        <li class="list-group-item m-0 p-1">
            <div class="row justify-content-between m-auto" id="confirmation-products-container">
                <!-- Products START -->
                <div class="col-3 product-image-small">
                    <img src="${product.image}" alt="${product.title}" />
                </div>
                <div class="col-8">
                    <h6 class="mb-2">${product.title}</h6>
                    <p class="my-0">${product.description}</p>
                    <div class="justify-content-between my-2">
                        <p class="my-0">Betyg: ${product.rating.rate}</p>
                        <p class="my-0">Antal röster: ${product.rating.count}</p>
                    </div>
                    <small class="capitalize">Kategori: ${product.category}</small>
                </div>
                <div class="col-1 text-center">
                    <div class="float-end">
                        <p>1</p>
                    </div>
                </div>
                <!-- Products END -->
                </div>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <strong>Totalsumma: </strong>
            <strong>${product.price} kr</strong>
        </li>

    
        `;
		$('#confirmation-order-right-info').html(productItemAllInfo);
	} else {
		console.log('Ingen produkt vald');
	}

	sessionStorage.setItem(
		'chosenProduct', // nyckel
		JSON.stringify(chosenProduct)
	);
});
