import { FirebaseOptions } from '@angular/fire/app';

import { AppEnvironment, EnviromentData, createEnvironmentHandler } from './environment.base';

export const environment: AppEnvironment = {
    production: true,
    name: 'production',
    apiBaseUrl: 'https://surubao-prod-01.onrender.com',
    stellar: {
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        sorobanRpcUrl: 'https://mainnet.sorobanrpc.com',
    },
    oracle: {
        reflector: {
            contractIdXlmUsdc: 'CALI2BYU2JE6WVRUFYTS6MSBNEHGJ35P4AVCZYF3B6QOE3QKOB2PLE6M',
            contractIdXlmUsdt: undefined,
            method: 'lastprice',
            decimals: 14,
            targetAsset: {
                type: 'native',
                code: 'XLM',
            },
            baseAsset: {
                type: 'stellar',
                code: 'USDC',
                issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
            },
        },
    },
    wallet: {
        preferred: 'freighter',
    },
    app: {
        version: 'M.M.P',
        cdnUrl: 'https://surubao-prod-01.s3.sa-east-1.amazonaws.com',
        vapidPublicKey: '*****************************************',
    },
};

export const firebaseEnvironment: FirebaseOptions = {
    projectId: 'surubao-01',
    appId: 'INSERT-APP-ID',
    storageBucket: 'INSERT-STORAGE-BUCKET',
    apiKey: 'INSERT-API-KEY',
    authDomain: 'INSERT-AUTH-DOMAIN',
    messagingSenderId: 'INSERT-MESSAGING-ID',
    measurementId: 'INSERT-MEASUMENT-ID',
};

export const AppEnvironmentHandler = createEnvironmentHandler(environment);

export type { AppEnvironment, EnviromentData };
