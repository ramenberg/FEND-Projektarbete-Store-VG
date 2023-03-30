$(document).ready(function () {
	const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo'));

	function showCustomerInfo(customer) {
		const container = $('#confirmation-customer-info');
		container.html(`
		<div class="row d-flex justify-content-between">
			<div class="col-md-12">
				<small>Adress:</small>
				<p>${customer.firstName} ${customer.lastName}<br>
				${customer.address}<br>
				${customer.postalCode} ${customer.city}<br>
				${customer.country}</p>
			</div>
			<div>
				<small>E-mail:</small>
				<p>${customer.email}</p>
				<small>Telefon:</small>
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
});
