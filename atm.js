import express, { response } from 'express'; 
import fetch from 'node-fetch';
import crypto from 'crypto';

//express config 
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

import { BitGo}  from 'bitgo';
import { coins } from '@bitgo/sdk-core';

//bitgo variable
const accessToken = 'v2x3d6e384e7393d2e042e545853b2d93916078bdcf1bd79e89dfb2993e4d9be81f';
const bitgo = new BitGo({ env: 'test', accessToken: accessToken});
const coin = 'ofc';
bitgo.register(coin, coins.Ofc.createInstance);

//const walletId = '6594fe863c12c28753a8f9dc84279857';
const tradeWallet = '6513b5ed0816d8000797bb3c864cae6d';

//Spot Price
const spotPrice = '';
async function getSpot(){

    const response = await fetch(`https://app.bitgo-test.com/api/prime/trading/v1/accounts/${tradeWallet}/products/GTETH-TUSD*/level1`, {
      headers: {
       'Content-Type': 'application/json',
       'accept': 'application/json',
       'Authorization': `Bearer v2x5735512faebba3ad7ccfc55adb3e7c04f4c8a11037955cc6623e04b955b0db9b`
       }
        
    });
    
    const data = await response.json();
    console.log(data)
    let spotPrice = (data.askPrice);
    return spotPrice;
    
    }
    
    
   const displaySpot = await getSpot();
   console.log(displaySpot);



//set express to ejs view 
app.set('view engine', 'ejs');

//res.render to view ejs file 

//index 

app.get('/', (req, res) => {
  const accessToken = 'v2x3d6e384e7393d2e042e545853b2d93916078bdcf1bd79e89dfb2993e4d9be81f';
const bitgo = new BitGo({ env: 'test', accessToken: accessToken});
const coin = 'ofc';
bitgo.register(coin, coins.Ofc.createInstance);

  const coinBal = [];
  let getBalance = fetch(`https://app.bitgo-test.com/api/prime/trading/v1/accounts/${tradeWallet}/balances`, {
    method: 'GET',
    headers: {
     'Content-Type': 'application/json',
     'accept': 'application/json',
     'Authorization': `Bearer ${accessToken}`
     }
    })
    .then(response => response.json())
    .then((getBalance) => {
       
       //calculate the amount of items in the currency list for loop.
       const data = getBalance;
       console.log(data)
       const balances = data['data'];
       console.log(balances)
       const dataLength = (balances.length);
       console.log(dataLength)
       //looking for specific currency GTETH
       
         for (let i =0; i < dataLength; i++) {
         if ( balances[i]['currency'] === 'GTETH') { //looking for GTETH
 
           coinBal.unshift({"name": balances[i]['currency'], "balance": balances[i]['balance']});
                        
         } else if ( balances[i]['currency'] === 'TUSD*') { //looking for TUSD
 
             coinBal.push({"name": balances[i]['currency'], "balance": balances[i]['balance']});
                
               
           }
          
        } 
      const result = coinBal;
      console.log(result);
      res.render('pages/index', {
        
        coinName: result[0]['name'],
        coinBalance: result[0]['balance'],
        ethUsd: displaySpot,
        tUsd: result[1]['balance']
     
    });


    })
  
});



//Trade Link
app.get('/trade', (req, res) => {

res.render('pages/trade');


});

//Webhook Transfer 
app.post('/webhook', (req, res) => {
    
    console.log(req.body);
    const value = req.body.value;
    const transfer = req.body.transfer;
    const receiver = req.body.receiver;
    
  
});

//Trade eth 
app.post('/run', (req, res) => {
    const eth = req.body.ethAmount;
    console.log(eth)
    const uuid = crypto.randomUUID();
    const body = {
      
    
      "clientOrderId": `${uuid}`,
      "type": "market",
      "product": "GTETH-TUSD*",
      "side": "sell",
      "quantity": `${eth}`,
      "quantityCurrency": "GTETH"
    
    }
//start of trade function
let tradeStatus = fetch('https://app.bitgo-test.com//api/prime/trading/v1/accounts/6513b5ed0816d8000797bb3c864cae6d/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
       'accept': 'application/json',
       'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)

})
.then(response => response.json())
.then((tradeStatus) => {
     console.log(tradeStatus)
    
     res.render('pages/success')   

})
})

//staking page 
app.get('/stake', (req, res) => {

    res.render('pages/stake ');
    
    
    });
    
app.post('/solstake', (req, res) => {

    const sol = req.body.solAmount;
    console.log(sol)
    const stakeUuid = crypto.randomUUID();
    const body = {
        
        "amount": `${sol}`,
        "clientId": `${stakeUuid}`,
        "type": "STAKE"
    
    };

    

});
  
  



app.listen(8080);
console.log('Server at 8080');