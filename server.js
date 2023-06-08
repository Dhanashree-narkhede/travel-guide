import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';
import cors from 'cors'

//load variable
dotenv.config();

//start server
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
//home route

app.get('/',(req,res) =>{
    res.sendFile('pay.html', {root:'public'});
});

//success
app.get('/success',(req,res) =>{
    res.sendFile('success.html', {root:'public'});
});
//cancel
app.get('/cancel',(req,res) =>{
    res.sendFile('cancel.html', {root:'public'});
});

//stripe
let data = 'sk_test_51NGH2jSAPBlkHXSEAo1TDf1bDtxv4atXkGedxvIKOa2JnGPo8NnOjYnAyKvT5YqOXolA2ArML1l6xgDvYaZiZELM00mWBY8ibB'
let stripeGateway = stripe(data);
let DOMAIN = 'http://localhost:3000'

app.post('/stripe-checkout', async(req,res) =>{
    try{
    const lineItems = req.body.items.map((item) =>{
        const unitAmount = parseInt(item.price.replace(/[^0.9.-]+/g, "")*100);
        console.log('item-price:',item.price);
        console.log('unitAmount:',unitAmount);
        return{
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.title
                    //images:[item.productimg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,

        };
    });
    console.log('lineItems:',lineItems);

    //create checkout session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        success_url:`${DOMAIN}/success`,
        cancel_url:`${DOMAIN}/cancel`,
        line_items:lineItems,
        //asking address in stripe checkout page
        billing_address_collection: 'required',

    });
    res.json(session.url);
}
catch(err)
{
    res.json(err)
}
});

app.listen(3000,() =>{
    console.log('listening on port 3000;', stripeGateway, DOMAIN);
});