const payBtn= document.querySelector('.btn-buy');

payBtn.addEventListener('click',() =>{
    fetch('http://localhost:3000/stripe-checkout', {
        method: 'post',
        headers: new Headers({'Content-Type':'application/Json'}),
        body:JSON.stringify({
            items: JSON.parse(localStorage.getItem('cartItems')),
        }),
    
    }).then((res)=>{
      res.json()
    }).then((data)=>{
        console.log(data,"dataCheck")
    }).catch((err)=>{
        console.log(err)
    })
    // .then((res) => res.json())
    // .then((url) => {
    //     location.href = url;
    // })
    // .catch((err) => console.log(err));                  
});
