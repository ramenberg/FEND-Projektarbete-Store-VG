$(document).ready(function () {
	//$.getJSON('https://fakestoreapi.com/products', products => $("#produkter").html(products))
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
});
