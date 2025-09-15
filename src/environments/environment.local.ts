// third
import { FirebaseOptions } from "@angular/fire/app";


export const ProductionEnvironmentName = 'prod';
export const ProductionBetaEnvironmentName = 'prod-beta';
export const DevelopmentEnvironmentName = 'dev';
export const LocalEnvironmentName = 'local';

export const environment: EnviromentData = {
    API_URL: 'http://localhost:2829',
    CDN_URL: 'http://localhost:2828',
    APP_VERSION: "0.0.0",

    // ENVIRONMENT_NAME: DevelopmentEnvironmentName,
    ENVIRONMENT_NAME: LocalEnvironmentName,
    VAPID_PUBLIC_KEY: "*****************************************",
};

export interface EnviromentData {
    API_URL: string,
    CDN_URL: string,
    APP_VERSION: string,

    ENVIRONMENT_NAME: string,

    VAPID_PUBLIC_KEY: string,
}

export const firebaseEnvironment: FirebaseOptions = {
    "projectId": "surubao-01",
    "appId": "INSERT-APP-ID",
    "storageBucket": "INSERT-STORAGE-BUCKET",
    "apiKey": "INSERT-API-KEY",
    "authDomain": "INSERT-AUTH-DOMAIN",
    "messagingSenderId": "INSERT-MESSAGING-ID",
    "measurementId": "INSERT-MEASUMENT-ID"
};

export class AppEnvironmentHandler {
    static GetEnviromentCollectionPrefix = () => {
        let value = '';

        value += environment.ENVIRONMENT_NAME + '-';

        return value;
    }

    static IsProd = () => {
        let value = false;

        value = environment.ENVIRONMENT_NAME == ProductionEnvironmentName

        return value;
    }

    static IsLocal = () => {
        let value = false;

        value = environment.ENVIRONMENT_NAME == LocalEnvironmentName

        return value;
    }

    static DoIfProduction = (callback: () => void) => {
        if (AppEnvironmentHandler.IsProd())
            callback();
    }

    static DoIfLocal = (callback: () => void) => {
        if (AppEnvironmentHandler.IsLocal())
            callback();
    }
}
