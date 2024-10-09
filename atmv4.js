import express from 'express'; 
import fetch from 'node-fetch';
import crypto from 'crypto';

//express config 
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

import { BitGo}  from 'bitgo';
import { coins } from '@bitgo/sdk-core';

//bitgo variable 
//enter your accesstoken 
const accessToken = '';
const bitgo = new BitGo({ env: 'test', accessToken: accessToken});
const coin = 'ofc';
bitgo.register(coin, coins.Ofc.createInstance);

//enter walletId tradingWallet ID 
const walletId = '';
const tradeWallet = '';
const stakeCoin = 'tsol';

//set express to ejs view 
app.set('view engine', 'ejs');

//res.render to view ejs file 

//to rework this as modules export in the near future. 
let ethPrice = '';
async function retrievePrice() {

        try{
            const response = await fetch(`https://app.bitgo-test.com/api/prime/trading/v1/accounts/${tradeWallet}/products/GTETH-TUSD*/level1`, {
                headers: {
                 'Content-Type': 'application/json',
                 'accept': 'application/json',
                 'Authorization': `Bearer ${accessToken}`
                }
                   
             });
             if(!response.ok){
                throw new Error(`HTTP Error ${response.status}`);
                }
            const data = await response.json();
            return ethPrice = data.askPrice;
        } catch (error) {
            console.error('Error with Price ETH:', error);
            throw error;
        }

    }
async function updatePrice() {
  ethPrice = await retrievePrice();
  //console.log(ethPrice)
}
//get initial pricing for eth 
updatePrice();




//get wallet information function 
let walletInfo = [];
async function getWalletDetails() {

    try{
        const response = await fetch(`https://app.bitgo-test.com/api/v2/${stakeCoin}/wallet/${walletId}`, {
            headers: {
             'Content-Type': 'application/json',
             'accept': 'application/json',
             'Authorization': `Bearer ${accessToken}`
            }
               
         });
         if(!response.ok){
            throw new Error(`HTTP Error ${response.status}`);
            }
        const walletData = await response.json();
        //console.log(walletData);
        //zeroing the array 
        walletInfo.length = 0;
        walletInfo.push({"confirmBalance" : walletData.confirmedBalanceString});
        walletInfo.push({"spendableBalance" : walletData.spendableBalanceString});
        walletInfo.push({"label": walletData.label});
        
    } catch (error) {
        console.error('Refer to Error msg:', error);
        throw error;
    }

}


let stakeInfo = [];
async function getStakeInfo() {

    try{
        const response = await fetch(`https://app.bitgo-test.com/api/staking/v1/${stakeCoin}/wallets/${walletId}`, {
            headers: {
             'Content-Type': 'application/json',
             'accept': 'application/json',
             'Authorization': `Bearer ${accessToken}`
            }
               
         });
         if(!response.ok){
            throw new Error(`HTTP Error ${response.status}`);
            }
        const stakeData = await response.json();
        //clear the array 
        stakeInfo.length = 0;
        stakeInfo.push({"name": stakeData.coin});
        stakeInfo.push({"reward": stakeData.rewards});
        stakeInfo.push({"apy": stakeData.apy});

    } catch (error) {
        console.error('Refer to Error msg:', error);
        throw error;
   }

}
//initial information to be loaded 
getStakeInfo();

//Index page

app.get('/', (req, res) => {
//get Ent walletDetails and run initial info
getWalletDetails();

//update ETH price whenever navigate to / site
updatePrice();
console.log(ethPrice);
//get Coin Balance for trade wallet account 
  let coinBal = [];
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
       const balances = data['data'];
       const dataLength = balances.length;
       //looking for specific currency GTETH
       
         for (let i =0; i < dataLength; i++) {
         if ( balances[i]['currency'] === 'GTETH') { //looking for GTETH
          //shift it to row 0 
           coinBal.unshift({"name": balances[i]['currency'], "balance": balances[i]['balance']});
                        
         } else if ( balances[i]['currency'] === 'TUSD*') { //looking for TUSD
 
             coinBal.push({"name": balances[i]['currency'], "balance": balances[i]['balance']});
      
   
               
           }
          
        } 
     
      res.render('pages/index', {
        
        coinName: coinBal[0]['name'],
        coinBalance: coinBal[0]['balance'],
        ethUsd: ethPrice,
        tUsd: coinBal[1]['balance']
        
    });


    })
  
});



//Trade Link
app.get('/trade', (req, res) => {
updatePrice();

res.render('pages/trade', {

 ethUsd: ethPrice

});


});

//Wallet Link
app.get('/wallet', (req, res) => {
    
    res.render('pages/wallet', {

    
    });
    
    
    });

app.post('/getadd', (req, res) => {
   
    const coinName = req.body.getCoin;
    console.log(coinName);
    const walletId = req.body.getId;
    console.log(walletId)
    let walletInfo = [];
    async function getWalletDetails() {
        
        try{                                      
            const response = await fetch(`https://app.bitgo-test.com/api/v2/${coinName}/wallet/${walletId}/addresses?includeBalances=true`, {
                method: 'GET',
                headers: {
                 'Content-Type': 'application/json',
                 'accept': 'application/json',
                 'Authorization': `Bearer ${accessToken}`
                }
                   
             });
             if(!response.ok){
                throw new Error(`HTTP Error ${response.status}`);
                }
            const walletData = await response.json();
            console.log(JSON.stringify(walletData, null, 4));
            //zeroing the array 
            walletInfo.length = 0;
            walletInfo.push({"confirmBalance" : walletData.confirmedBalanceString});
            walletInfo.push({"spendableBalance" : walletData.spendableBalanceString});
            walletInfo.push({"label": walletData.label});
            
        } catch (error) {
            console.error('Refer to Error msg:', error);
            throw error;
        }

      

    
    }
    getWalletDetails();



}





)

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
//call stake and wallet get info functions
getStakeInfo();
getWalletDetails();

let rewards = stakeInfo[1]['reward'];
let apyRate = stakeInfo[2]['apy'];
console.log('this is',walletInfo[1]);
    res.render('pages/stake', {
        
        apyRate: apyRate,
        solRewards: rewards,
        walletLabel: walletInfo[2]['label'],
        confirmedBalance: walletInfo[0]['confirmBalance'],
        spendableBalance: walletInfo[1]['spendableBalance']

         });
    
    
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
