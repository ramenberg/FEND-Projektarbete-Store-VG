$(document).ready(function () {
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
});
