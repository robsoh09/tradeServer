/**
 * Get a list of currenct network balances
 *
 * Copyright 2023, BitGo, Inc.  All Rights Reserved.
 */

import { BitGoAPI } from '@bitgo/sdk-api';
import { coins } from '@bitgo/sdk-core';

const OFC_WALLET_ID = '6513b5ed0816d8000797bb3c864cae6d';

const bitgo = new BitGoAPI({
  accessToken: 'v2x3d6e384e7393d2e042e545853b2d93916078bdcf1bd79e89dfb2993e4d9be81f',
  env: 'test',
});

const coin = 'ofc';
bitgo.register(coin, coins.Ofc.createInstance);

async function main() {
  const tradingAccount = (await bitgo.coin('ofc').wallets().get({ id: OFC_WALLET_ID })).toTradingAccount();

  const tradingNetwork = tradingAccount.toNetwork();

  const tradingNetworkBalances = await tradingNetwork.getBalances();

  console.log('Balances', tradingNetworkBalances);
}
main().catch((e) => console.error(e));