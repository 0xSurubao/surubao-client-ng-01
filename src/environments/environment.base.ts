export type EnvironmentName = 'local' | 'development' | 'prod-beta' | 'production';

export type OracleAssetType = 'native' | 'stellar' | 'external';

export interface OracleAssetConfig {
    readonly type: OracleAssetType;
    readonly code: string;
    readonly issuer?: string;
}

export interface OracleReflectorConfig {
    readonly contractIdXlmUsdc?: string;
    readonly contractIdXlmUsdt?: string;
    readonly method: string;
    readonly decimals: number;
    readonly targetAsset: OracleAssetConfig;
    readonly baseAsset: OracleAssetConfig;
}

export interface StellarConfig {
    readonly networkPassphrase: string;
    readonly sorobanRpcUrl: string;
}

export interface WalletConfig {
    readonly preferred: string;
}

export interface AppMeta {
    readonly version: string;
    readonly cdnUrl: string;
    readonly vapidPublicKey: string;
}

export interface AppEnvironment {
    readonly production: boolean;
    readonly name: EnvironmentName;
    readonly apiBaseUrl: string;
    readonly stellar: StellarConfig;
    readonly oracle: {
        readonly reflector: OracleReflectorConfig;
    };
    readonly wallet: WalletConfig;
    readonly app: AppMeta;
}

export type EnviromentData = AppEnvironment;

export interface EnvironmentHandler {
    GetEnviromentCollectionPrefix(): string;
    IsProd(): boolean;
    IsLocal(): boolean;
    DoIfProduction(callback: () => void): void;
    DoIfLocal(callback: () => void): void;
}

export const createEnvironmentHandler = (env: AppEnvironment): EnvironmentHandler => ({
    GetEnviromentCollectionPrefix: () => `${env.name}-`,
    IsProd: () => env.name === 'production',
    IsLocal: () => env.name === 'local',
    DoIfProduction: (callback: () => void) => {
        if (env.name === 'production') {
            callback();
        }
    },
    DoIfLocal: (callback: () => void) => {
        if (env.name === 'local') {
            callback();
        }
    },
});
