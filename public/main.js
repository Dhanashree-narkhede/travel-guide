//cart open close
let cartIcon =document.querySelector('#cart-icon');
let cart =document.querySelector('.cart');
let closeCart =document.querySelector('#close-cart');

//open
cartIcon.onclick = () => {
    cart.classList.add("active");
};
//close
closeCart.onclick = () => {
    cart.classList.remove("active");
};

//add to cart

if(document.readyState == 'loadind'){
    document.addEventListener('DOMContentLoaded', ready);
}else{
    ready();
}

function ready(){
    //remove item
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for(var i = 0; i<removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    //quantity change
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for(var i = 0; i<quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    //Add to cart
    var addCart= document.getElementsByClassName('add-cart');
    for(var i = 0; i<addCart.length; i++){
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
}

// Remove cart item--
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();

}

//Quantity change--
function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value<=0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

//add cart function--
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price= shopProducts.getElementsByClassName('price')[0].innerText;
    //var prodcutImg = shopProducts.getElementsByClassName()
    addProductToCart(title,price);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}
//--

function addProductToCart(title,price){
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for(var i = 0; i<cartItemsNames.length;i++){
        if(cartItemsNames[i].innerText == title){
            alert("alredy added");
            return;
        }
    }
    var cartBoxContent = `
    <div class="detail-box">
        <div class="cart-product-title">
            ${title}
        </div>
        <div class="cart-price">${price}</div>
        <input 
        type="number"
        name=""
        id=""
        value="1"
        class="cart-quantity"
        />
    </div>
    
    
    <i class='bx bx-trash-alt cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
    .getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem);
    cartShopBox
    .getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon();
}

//update total--
function updatetotal(){
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total=0;
    for(var i=0; i<cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement =cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('$',''));
        var quantity = quantityElement.value;
        total+= price * quantity;

    }
    //round off
    total=Math.round(total*100)/100;
    document.getElementsByClassName('total-price')[0].innerText = '$' + total;
    //save to localstorage
    localStorage.setItem('cartTotal',total);


}

//keep item after reload--
function saveCartItems(){
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];

    for(var i=0; i<cartBoxes.length;i++){
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cart.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        
        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
        };
        cartItems.push(item); 
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
//loads in cart--
function loadCartItems(){
    var cartItems=localStorage.getItem('cartItems');
    if(cartItems){
        cartItems=JSON.parse(cartItems);

        for(var i=0; i<cartItems.length;i++){
            var item=cartItems[i];
            addProductToCart(item.title, item.price);

            var cartBoxes=document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement= cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    
    }
    var cartTotal =localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText=
        "$" +cartTotal;
    }
    updateCartIcon();
}

//quantity in cart icon--
function updateCartIcon(){
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity=0;

    for(var i=0; i<cartBoxes.length; i++){
        var cartBox =cartBoxes[i];
        var quantityElement=cartBox.getElementsByClassName('cart-quantity')[0];
        quantity+= parseInt(quantityElement.value);
    }
    var cartIcon= document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity',quantity);
}