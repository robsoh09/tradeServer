import express from 'express'; 
const app = express(); 
app.use(express.json());

import { BitGo}  from 'bitgo';
//bitgo variable
const accessToken = 'v2x3d6e384e7393d2e042e545853b2d93916078bdcf1bd79e89dfb2993e4d9be81f';
const bitgo = new BitGo({ env: 'test', accessToken: accessToken});
const coin = 'ttrx:usdt';
//const accessToken = 'v2x3f1baad5e9d3908b50a54a75fed60c2fc1a52e7e77992379bf3ae60c267a75cc';

const walletId = '6594fe863c12c28753a8f9dc84279857';
const tradeWallet = '6513b5ed0816d8000797bb3c864cae6d';

//get address 
async function getDetails() {
    const wallet = await bitgo.coin(coin).wallets().get({ id: walletId});
    const address = await wallet.addresses();
    const label = address.addresses[0].label;
    const tronAdd = address.addresses[0].address; 
    const tronBalance = (wallet.confirmedBalanceString());
    const tronUsdtBalance = (wallet.spendableBalanceString());
     return { tronAdd, label, tronBalance, tronUsdtBalance };
     

}
const result = await getDetails();
console.log(result);


//set express to ejs view 
app.set('view engine', 'ejs');


//res.render to view ejs file 

//index 

app.get('/', (req, res) => {

res.render('pages/index', {
    
    tronAdd: result.tronAdd,
    label: result.label,
    tronBalance: result.tronBalance,
    tronUsdtBalance: result.tronUsdtBalance
});

});

//about 
app.get('/about', (req, res) => {

res.render('pages/about');


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



