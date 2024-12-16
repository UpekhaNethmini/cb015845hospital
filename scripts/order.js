document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector("#cart-table tbody");
    const totalPriceElement = document.getElementById("total-price");

    let totalPrice = 0;

    // Display cart items in the table
    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>LKR ${item.price}</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.price * item.quantity}</td>
        `;
        cartTableBody.appendChild(row);
        totalPrice += item.price * item.quantity;
    });

    // Update the total price
    totalPriceElement.textContent = `Total Price: LKR ${totalPrice}`;
    
    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardDetails = document.getElementById('card-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            if (document.getElementById('card').checked) {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Handle order form submission
    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !address) {
            alert("Please fill in all required fields (Name, Phone, Address).");
            return;
        }

        if (document.getElementById('card').checked) {
            const cardNumber = document.getElementById('card-number').value.trim();
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!cardNumber || !expiryDate || !cvv) {
                alert("Please fill in all Credit Card details.");
                return;
            }

            if (!/^\d{16}$/.test(cardNumber)) {
                alert("Card Number must be 16 digits.");
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert("Expiry Date must be in MM/YY format.");
                return;
            }

            if (!/^\d{3}$/.test(cvv)) {
                alert("CVV must be 3 digits.");
                return;
            }
        }

        const currentDate = new Date();
        const deliveryDays = 3; // Set the number of delivery days
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + deliveryDays);
    
        // Format the delivery date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', options);
    
        // Display the alert with the delivery date
        alert(`Order Confirmed! Your order will be delivered by approximately ${formattedDeliveryDate}.`);
    });


    // Back to Pharmacy Button functionality
    document.getElementById('back-to-pharmacy').addEventListener('click', () => {
        window.location.href = 'pharmacy.html'; // Redirects to pharmacy.html
    });
});
