import { FirebaseOptions } from '@angular/fire/app';

import { AppEnvironment, EnviromentData, createEnvironmentHandler } from './environment.base';

export const environment: AppEnvironment = {
    production: false,
    name: 'development',
    apiBaseUrl: 'https://surubao-dev-01.onrender.com',
    stellar: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
    },
    oracle: {
        reflector: {
            contractIdXlmUsdc: 'CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP',
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
        cdnUrl: 'https://surubao-dev-01.s3.sa-east-1.amazonaws.com',
        vapidPublicKey: '*****************************************',
    },
};

export const firebaseEnvironment: FirebaseOptions = {
    projectId: 'INSERT-PROJECT-ID',
    appId: 'INSERT-APP-ID',
    storageBucket: 'INSERT-STORAGE-BUCKET',
    apiKey: 'INSERT-API-KEY',
    authDomain: 'INSERT-AUTH-DOMAIN',
    messagingSenderId: 'INSERT-MESSAGING-ID',
    measurementId: 'INSERT-MEASUMENT-ID',
};

export const AppEnvironmentHandler = createEnvironmentHandler(environment);

export type { AppEnvironment, EnviromentData };
