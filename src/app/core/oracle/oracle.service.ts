import { Injectable } from '@angular/core';
import
{
    Account,
    Asset,
    BASE_FEE,
    Contract,
    Keypair,
    Networks,
    TransactionBuilder,
    rpc,
    scValToNative,
    xdr,
    Address,

} from '@stellar/stellar-sdk';

import { OracleAssetConfig } from '../../../environments/environment.base';
import { environment } from '../../../environments/environment';

export interface OraclePricePoint
{
    readonly price: number;
    readonly rawPrice: bigint;
    readonly timestamp: number;
    readonly rawTimestamp: bigint;
}

@Injectable({ providedIn: 'root' })
export class OracleService
{
    private readonly networkPassphrase = environment.stellar.networkPassphrase;
    private readonly server = new rpc.Server(environment.stellar.sorobanRpcUrl, {
        allowHttp: environment.stellar.sorobanRpcUrl.startsWith('http://'),
    });
    private readonly contractId: string;
    private readonly method = environment.oracle.reflector.method ?? 'lastprice';
    private readonly decimals = environment.oracle.reflector.decimals ?? 7;
    private readonly targetAsset = environment.oracle.reflector.targetAsset;

    constructor()
    {
        const resolvedContractId =
            environment.oracle.reflector.contractIdXlmUsdc ?? environment.oracle.reflector.contractIdXlmUsdt;
        if (!resolvedContractId)
        {
            throw new Error('Reflector contract ID is not configured in the environment.');
        }
        this.contractId = resolvedContractId;
    }

    async fetchLatestPrice(): Promise<OraclePricePoint>
    {
        const contract = new Contract(this.contractId);
        const account = new Account(Keypair.random().publicKey(), '0');

        const contractId = Asset.native().contractId(this.networkPassphrase);

        let assetScVal = xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol('Stellar'),
            new Address(contractId).toScVal(),
        ]);

        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: this.networkPassphrase,
            timebounds: { minTime: 0, maxTime: 0 },
        })
            // .addOperation(contract.call('assets', assetScVal))
            // .addOperation(contract.call('assets'))
            .addOperation(contract.call('lastprice', assetScVal))
            .setTimeout(30)
            .build();

        const simulation = await this.server.simulateTransaction(transaction);

        console.log('#### 01-01 | simulation = ', simulation);
        console.log('#### 01-02 | transaction = ', transaction);


        let test01: rpc.Api.SimulateTransactionSuccessResponse = simulation as rpc.Api.SimulateTransactionSuccessResponse;
        // let test01: rpc.Api.SimulateTransactionSuccessResponse = simulation as rpc.Api.SimulateTransactionSuccessResponse;

        if (test01.result)
        {
            console.log(">>>>> contractId = ", contractId);

            let result = scValToNative(test01.result.retval);

            // the result is a ScVal and so we can parse that to human readable output using the sdk's `scValToNative` function:
            console.log("humanReadable Result:", result);
            console.log("latestLedger:", test01.latestLedger);
        }

        if ('error' in simulation && simulation.error)
        {
            throw new Error(`Oracle simulation failed: ${simulation.error}`);
        }

        if (!('result' in simulation) || !simulation.result?.retval)
        {
            throw new Error('Oracle returned an empty response.');
        }

        const native = scValToNative(simulation.result.retval) as { price: bigint; timestamp: bigint } | null;
        if (!native || typeof native.price === 'undefined' || typeof native.timestamp === 'undefined')
        {
            throw new Error('Oracle returned unexpected data.');
        }

        const price = Number(native.price) / Math.pow(10, this.decimals);
        const timestamp = Number(native.timestamp) * 1000;

        return {
            price,
            rawPrice: native.price,
            timestamp,
            rawTimestamp: native.timestamp,
        };
    }

    private buildAssetScVal(config: OracleAssetConfig): xdr.ScVal
    {
        if (config.type === 'native')
        {
            const contractId = Asset.native().contractId(this.networkPassphrase);
            return this.buildStellarAssetScVal(contractId);
        }

        if (config.type === 'stellar')
        {
            if (!config.issuer)
            {
                throw new Error(`Missing issuer for asset ${config.code}`);
            }
            const contractId = new Asset(config.code, config.issuer).contractId(this.networkPassphrase);
            return this.buildStellarAssetScVal(contractId);
        }

        return xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol('Other'),
            xdr.ScVal.scvSymbol(config.code),
        ]);
    }

    private buildStellarAssetScVal(contractId: string): xdr.ScVal
    {
        return xdr.ScVal.scvVec([
            xdr.ScVal.scvSymbol('Stellar'),
            new Address(contractId).toScVal(),
        ]);
    }
}
