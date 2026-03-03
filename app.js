/**
 * Savor - Premium Food Delivery Platform Logic
 */

// --- Mock Data ---
const menuItems = [
    { id: 1, name: "Truffle Mushroom Pasta", category: "comfort", price: 1999, rating: 4.8, img: "https://images.unsplash.com/photo-1555949258-eb39fa0d8619?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Spicy Tuna Roll", category: "bestseller", price: 1480, rating: 4.9, img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Wagyu Beef Burger", category: "comfort", price: 1760, rating: 4.7, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Açaí Smoothie Bowl", category: "bestseller", price: 1120, rating: 4.6, img: "https://images.unsplash.com/photo-1590301157890-4810ed35a4d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Crispy Fried Chicken", category: "comfort", price: 1599, rating: 4.8, img: "https://images.unsplash.com/photo-1626082927389-6cd097cbc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Margherita Pizza", category: "bestseller", price: 1280, rating: 4.5, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
];

let reviews = [
    { id: 1, user: "Alex J.", item: "Truffle Mushroom Pasta", rating: 5, text: "Absolutely incredible! The earthy flavors were perfect and delivery was super fast." },
    { id: 2, user: "Sarah M.", item: "Wagyu Beef Burger", rating: 4, text: "Very juicy and flavorful, though the fries could have been crispier." }
];

// --- Application State ---
let currentUser = {
    username: "",
    address: ""
};

let cart = [];

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const userDisplay = document.getElementById('user-display');
const currentAddressDisplay = document.getElementById('current-address-display');
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const reviewsList = document.getElementById('reviews-list');
const reviewForm = document.getElementById('review-form');
const starIcons = document.querySelectorAll('.rating-select i');
const selectedRatingInput = document.getElementById('selected-rating');

// Chatbot Elements
const chatbotWidget = document.getElementById('chatbot-widget');
const toggleChatBtn = document.getElementById('toggle-chat');
const chatHeader = document.querySelector('.chat-header');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const promptChips = document.querySelectorAll('.prompt-chip');

// Cart & Checkout Elements
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');
const paymentForm = document.getElementById('payment-form');
const checkoutAddress = document.getElementById('checkout-address');
const checkoutAmount = document.getElementById('checkout-amount');
const paymentMethods = document.querySelectorAll('input[name="payment"]');
const cardDetailsSection = document.getElementById('card-details');

// --- Initialization & View Management ---

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser.username = document.getElementById('username').value;
    currentUser.address = document.getElementById('address').value;

    // Smooth transition
    loginView.style.opacity = '0';
    setTimeout(() => {
        loginView.classList.remove('active');
        appView.classList.remove('hidden');
        appView.classList.add('active');

        // Populate user info
        userDisplay.textContent = currentUser.username;
        currentAddressDisplay.textContent = currentUser.address;

        // Trigger initial renders
        renderMenu('all');
        renderReviews();
    }, 500);
});

// --- Menu & Rendering ---

function renderMenu(filter) {
    menuGrid.innerHTML = ''; // clear
    let filteredItems = menuItems;
    if (filter !== 'all') {
        filteredItems = menuItems.filter(item => item.category === filter);
    }

    filteredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="food-img">
            <div class="food-info">
                <h4>${item.name}</h4>
                <div class="food-meta">
                    <span><i class="fa-solid fa-star"></i> ${item.rating}</span>
                    <span>30-45 min</span>
                </div>
                <div class="food-action">
                    <span class="price">₹${item.price.toLocaleString('en-IN')}</span>
                    <button class="add-btn" onclick="addToCart('${item.name}')">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Filter clicks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
    });
});

window.addToCart = function (itemName) {
    const item = menuItems.find(i => i.name === itemName);
    if (!item) return;

    const existingItem = cart.find(i => i.name === itemName);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();

    // Basic mock order feedback
    const btnBox = event.currentTarget;
    btnBox.innerHTML = '<i class="fa-solid fa-check"></i>';
    btnBox.style.background = 'var(--success)';

    setTimeout(() => {
        btnBox.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btnBox.style.background = 'var(--primary)';

        // Only trigger chatbot if it's the first time adding this item
        if (!existingItem) {
            addBotMessage(`I see you've added **${itemName}** to your cart! Excellent choice. Let me know when you want to checkout.`);
            if (chatbotWidget.classList.contains('closed')) {
                openChat();
            }
        }
    }, 1000);
}

// --- Cart Logic ---

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // Update Draw
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        checkoutBtn.disabled = true;
        cartTotalPrice.textContent = '₹0';
        return;
    }

    checkoutBtn.disabled = false;
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <span style="color: var(--primary);">₹${item.price.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
}

window.updateQty = function (index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// Cart Drawer open/close
cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
});

// --- Checkout Logic ---

checkoutBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    checkoutAddress.textContent = currentUser.address;
    checkoutAmount.textContent = cartTotalPrice.textContent;
    checkoutModal.classList.remove('hidden');
});

closeCheckoutBtn.addEventListener('click', () => {
    checkoutModal.classList.add('hidden');
});

paymentMethods.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            cardDetailsSection.style.display = 'block';
            cardDetailsSection.querySelectorAll('input').forEach(i => i.required = true);
        } else {
            cardDetailsSection.style.display = 'none';
            cardDetailsSection.querySelectorAll('input').forEach(i => i.required = false);
        }
    });
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = paymentForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Order Placed!';
        btn.style.background = 'var(--success)';

        setTimeout(() => {
            // Reset
            checkoutModal.classList.add('hidden');
            cart = [];
            updateCartUI();
            btn.innerHTML = 'Pay Now';
            btn.style.background = '';
            btn.disabled = false;
            paymentForm.reset();

            // Notify user
            addBotMessage(`🎉 **Order Successfully Placed!** Your food is being prepared and will be delivered to ${currentUser.address} shortly. Enjoy your meal!`);
            if (chatbotWidget.classList.contains('closed')) {
                openChat();
            }
        }, 1500);

    }, 2000);
});

// --- Reviews ---

function renderReviews() {
    reviewsList.innerHTML = '';
    reviews.slice().reverse().forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="reviewer">
                <div class="avatar" style="width: 30px; height: 30px;"><i class="fa-solid fa-user" style="font-size: 0.8rem;"></i></div>
                <div>
                    <strong>${review.user}</strong>
                    <div class="review-stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(review.rating)}${'<i class="fa-regular fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            <strong>Ordered: ${review.item}</strong>
            <p style="margin-top: 0.5rem; color: var(--text-muted);">${review.text}</p>
        `;
        reviewsList.appendChild(div);
    });
}

// Star rating logic
starIcons.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        selectedRatingInput.value = rating;

        starIcons.forEach((s, index) => {
            if (index < rating) {
                s.className = 'fa-solid fa-star active';
            } else {
                s.className = 'fa-regular fa-star';
            }
        });
    });
});

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rating = parseInt(selectedRatingInput.value);

    if (rating === 0) {
        alert("Please select a rating parameter.");
        return;
    }

    const newReview = {
        id: Date.now(),
        user: currentUser.username,
        item: document.getElementById('review-item').value,
        rating: rating,
        text: document.getElementById('review-text').value
    };

    reviews.push(newReview);
    renderReviews();

    // Reset
    reviewForm.reset();
    selectedRatingInput.value = 0;
    starIcons.forEach(s => s.className = 'fa-regular fa-star');

    addBotMessage(`Thank you for your feedback on the ${newReview.item}, ${currentUser.username}! We appreciate your review.`);
});


// --- Savor AI Chatbot Logic ---

// Expanded intents for a more fluent experience
const aiIntents = [
    {
        name: 'greeting',
        keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening', 'afternoon'],
        responses: [
            "Hello there! How can Savor AI assist you with your culinary desires today?",
            "Hi! Welcome to Savor. Are you looking to order something delicious?",
            "Greetings! Savor AI at your service. Let me know if you need recommendations or help ordering."
        ]
    },
    {
        name: 'how_to_order',
        keywords: ['how to order', 'place order', 'buy food', 'how to buy', 'make an order', 'add to cart'],
        responses: [
            "It's simple! Just browse our **Menu**, find a dish you like, and click the circular **+** button to add it to your cart. Then click the cart icon in the top right to checkout!",
            "To place an order, scroll through the food cards and use the **+** button. When you're ready, open your Cart Drawer and proceed to checkout!"
        ]
    },
    {
        name: 'order_status',
        keywords: ['where is my food', 'order status', 'track order', 'when will it arrive', 'delivery time'],
        responses: [
            "Our average delivery time is 30-45 minutes. Your food is currently being prepared hot and fresh!",
            "I checked on your order! The kitchen is preparing it carefully, and our rider will be dispatched shortly."
        ]
    },
    {
        name: 'menu_inquiry',
        keywords: ['what is on the menu', 'what can i eat', 'show menu', 'what do you have', 'options'],
        responses: [
            "We have a premium selection! Our bestsellers include the **Spicy Tuna Roll** and **Margherita Pizza**. We also have comfort food like **Truffle Mushroom Pasta** and **Wagyu Beef Burger**.",
            "If you look at the Menu section above, you'll see our diverse cuisine, ranging from artisan pizzas and sushi to gourmet burgers and smoothies!"
        ]
    },
    {
        name: 'recommend_mood_sad',
        keywords: ['sad', 'upset', 'depressed', 'lonely', 'down', 'stress', 'stressed', 'tired'],
        responses: [
            "I'm sorry you're feeling that way. Comfort food works wonders! I highly recommend our **Truffle Mushroom Pasta** or **Crispy Fried Chicken**. Need a virtual hug?",
            "Rough day? A warm, hearty meal might help. How about a juicy **Wagyu Beef Burger** to lift your spirits?"
        ]
    },
    {
        name: 'recommend_mood_happy',
        keywords: ['happy', 'excited', 'great', 'joy', 'celebrate', 'amazing'],
        responses: [
            "That's wonderful! Why not treat yourself? A **Spicy Tuna Roll** or our signature dishes are perfect for celebrating a good mood!",
            "Love the energy! You deserve something fresh and vibrant, like our **Açaí Smoothie Bowl** or a premium pizza!"
        ]
    },
    {
        name: 'recommend_general',
        keywords: ['recommend', 'recommendation', 'what should i eat', 'best food', 'popular', 'suggest'],
        responses: [
            "If you want something light, go for the **Açaí Smoothie Bowl**. If you want something decadent, the **Truffle Mushroom Pasta** is a fan favorite!",
            "Our absolute bestseller is the **Spicy Tuna Roll**. It's highly rated by all our customers!"
        ]
    },
    {
        name: 'address_change',
        keywords: ['change address', 'update location', 'wrong address', 'deliver somewhere else'],
        responses: [
            "To change your delivery address, you simply need to log out and log back in from the welcome screen, providing your new address.",
            "Currently, your address is set to your login location. To update it, just refresh the page and enter the new address at the Savor login!"
        ]
    },
    {
        name: 'payment_methods',
        keywords: ['how to pay', 'payment options', 'accept card', 'cash on delivery', 'upi'],
        responses: [
            "We accept major Credit/Debit Cards, UPI for instant transfers, and Cash on Delivery. You can choose your preferred method during Checkout!",
            "When you proceed to checkout from your cart, you'll be able to select Card, UPI, or Cash seamlessly."
        ]
    },
    {
        name: 'complaint',
        keywords: ['food is bad', 'cold', 'wrong order', 'terrible', 'refund', 'complaint'],
        responses: [
            "I apologize sincerely for the inconvenience! Because this is a simulation, your digital food should theoretically be perfect. In a real scenario, we'd refund you immediately!",
            "Oh no! We strive for culinary perfection. Please leave a 1-star review in the review section below so our executive chef can address this simulated feedback."
        ]
    },
    {
        name: 'thanks',
        keywords: ['thank you', 'thanks', 'appreciate', 'perfect', 'awesome'],
        responses: [
            "You're very welcome! Let me know if there's anything else you need.",
            "My pleasure! Enjoy your Savor experience."
        ]
    },
    {
        name: 'farewell',
        keywords: ['bye', 'goodbye', 'see you', 'quit'],
        responses: [
            "Goodbye! We hope to serve you again soon at Savor.",
            "Take care! Your culinary concierge is always here if you need me."
        ]
    },
    {
        name: 'identity',
        keywords: ['who are you', 'are you a bot', 'what are you', 'are you real'],
        responses: [
            "I form the digital consciousness of Savor! I'm an AI assistant designed to help you order food, find recommendations, and ensure your experience is premium.",
            "I'm Savor AI! I live in the code to help you navigate our menu and answer any questions you might have."
        ]
    }
];

// Fallback responses
const fallbackResponses = [
    "I'm not quite sure how to answer that, but I'm learning every day! Is there anything I can help you with regarding the menu or your order?",
    "That's an interesting thought! As a culinary AI, I specialize in food orders, menu recommendations, and delivery details. Can I help you with any of those?",
    "I might need a little more clarity. Are you looking to order food, change your address, or find a meal that fits your mood?"
];

// Random picker utility
const getRandomResponse = (array) => array[Math.floor(Math.random() * array.length)];

function processAiResponse(input) {
    const lowerInput = input.toLowerCase();

    // Show a "typing..." indicator for realism
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `<div class="msg-bubble" style="color: var(--text-muted);"><i class="fa-solid fa-ellipsis fa-fade"></i></div>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate thinking/network delay
    setTimeout(() => {
        // Remove typing indicator
        const tDiv = document.getElementById(typingId);
        if (tDiv) tDiv.remove();

        // 1. Check for specific dynamic intents first
        if (lowerInput.includes('my address')) {
            addBotMessage(`Your current delivery address is registered as: **${currentUser.address}**.`);
            return;
        }

        // 2. Iterate through predefined intents
        let matchedIntent = null;
        let maxMatches = 0;

        for (const intent of aiIntents) {
            let matchCount = 0;
            for (const keyword of intent.keywords) {
                // simple boundary check to avoid substring matches like "hi" in "this"
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (regex.test(lowerInput) || lowerInput.includes(keyword)) {
                    matchCount++;
                }
            }
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                matchedIntent = intent;
            }
        }

        // 3. Respond based on match or fallback
        if (matchedIntent) {
            const reply = getRandomResponse(matchedIntent.responses);
            // Personalize the greeting rarely
            if (matchedIntent.name === 'greeting' && Math.random() > 0.5) {
                addBotMessage(`Hello ${currentUser.username}! ` + reply.replace(/Hello there! |Hi! |Greetings! /, ''));
            } else {
                addBotMessage(reply);
            }
        } else {
            addBotMessage(getRandomResponse(fallbackResponses));
        }

    }, 800 + Math.random() * 600); // Random delay between 800ms to 1400ms for fluent feel
}

const toggleChat = () => {
    chatbotWidget.classList.toggle('closed');
    const icon = toggleChatBtn.querySelector('i');
    if (chatbotWidget.classList.contains('closed')) {
        icon.className = 'fa-solid fa-chevron-up';
    } else {
        icon.className = 'fa-solid fa-chevron-down';
    }
};

const openChat = () => {
    if (chatbotWidget.classList.contains('closed')) {
        toggleChat();
    }
};

chatHeader.addEventListener('click', (e) => {
    if (e.target !== toggleChatBtn && e.target.parentElement !== toggleChatBtn) {
        toggleChat();
    }
});
toggleChatBtn.addEventListener('click', toggleChat);


function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'message ai';
    // Handle simple markdown-like bold text (e.g. **text**)
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    div.innerHTML = `<div class="msg-bubble">${formattedText}</div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = '';

    processAiResponse(text);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.dataset.prompt;
        addUserMessage(text);
        processAiResponse(text);
    });
});
