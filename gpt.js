import express from 'express'; 
import fetch from 'node-fetch';
const app = express(); 
app.use(express.json());

import { BitGo}  from 'bitgo';
import { coins } from '@bitgo/sdk-core';

//bitgo variable
const accessToken = 'v2x3d6e384e7393d2e042e545853b2d93916078bdcf1bd79e89dfb2993e4d9be81f';
const bitgo = new BitGo({ env: 'test', accessToken: accessToken});
const coin = 'ofc';
//const accessToken = 'v2x3f1baad5e9d3908b50a54a75fed60c2fc1a52e7e77992379bf3ae60c267a75cc';
bitgo.register(coin, coins.Ofc.createInstance);

//const walletId = '6594fe863c12c28753a8f9dc84279857';
const tradeWallet = '6513b5ed0816d8000797bb3c864cae6d';
const coinBal = [];
//get info 
async function getDetails() {

    const response = await fetch(`https://app.bitgo-test.com/api/prime/trading/v1/accounts/${tradeWallet}/balances`, {
        method: 'GET',
        headers: {
         'Content-Type': 'application/json',
         'accept': 'application/json',
         'Authorization': `Bearer ${accessToken}`
         }
     
      });
      
      //calculate the amount of items in the currency list for loop.
      const data = await response.json();
      console.log(data.data)
      const balances = data['data'];
      const dataLength = ((balances.length))
      
      //looking for specific currency GTETH
      for (let i =0; i <= dataLength; i++) {
        if ( balances[i]['currency'] === 'GTETH') { //looking for GTETH

          coinBal.push({"name": balances[i]['currency'], "balance": balances[i]['balance']});
                       
        } else if ( balances[i]['currency'] === 'TUSD*') { //looking for TUSD

            coinBal.push({"name": balances[i]['currency'], "balance": balances[i]['balance']});
                            
            return coinBal;       
              
          }
        
        
       }

      
        
      }
    
      

const result = await getDetails();
console.log(result[0]['name'])
console.log(result[1]['name'])


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

res.render('pages/index', {
    
    coinName: result[0]['name'],
    coinBalance: result[0]['balance'],
    ethUsd: displaySpot,
    tUsd: result[1]['balance']
});

});

//about 
app.get('/trade', (req, res) => {

res.render('pages/trade');


});

//Webhook Transfer 
app.post('/webhook', (req, res) => {
    
    console.log(req.body);
    const value = req.body.value;
    const transfer = req.body.transfer;
    const receiver = req.body.receiver;
    
   
   
    /*res.render('pages/webhook', {
       transfer: req.body.transfer,
       value: req.body.value,
       receiver: req.body.receiver


    }); */ 



});

app.listen(8080);
console.log('Server at 8080');



