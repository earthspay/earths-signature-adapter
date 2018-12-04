import { Adapter } from './Adapter';
import { AdapterType } from '../config';
import { EarthsLedger } from '@earths/ledger';


export class LedgerAdapter extends Adapter {

    private _currentUser;
    public static type = AdapterType.Ledger;
    private static _ledger;
    private static _hasConnectionPromise;

    constructor(user) {
        super();
        this._currentUser = user;

        if (!this._currentUser) {
            throw 'No selected user';
        }
    }

    public isAvailable() {
        return this._isMyLedger();
    }

    public getPublicKey() {
        return Promise.resolve(this._currentUser.publicKey);
    }

    public getAddress() {
        return Promise.resolve(this._currentUser.address);
    }

    public getSeed() {
        return Promise.reject(Error('Method "getSeed" is not available!'));
    }

    public getAdapterVersion() {
        return LedgerAdapter._ledger.getVersion();
    }
    
    public signRequest(bytes: Uint8Array): Promise<string> {
        return  this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signRequest(this._currentUser.id, bytes));
    }

    public signTransaction(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        if (bytes[0] === 4) {
            return this.signData(bytes);
        }
        
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signTransaction(this._currentUser.id, {precision: amountPrecision}, bytes));
    }

    public signOrder(bytes: Uint8Array, amountPrecision: number): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signOrder(this._currentUser.id, {precision: amountPrecision}, bytes));
    }

    public signData(bytes: Uint8Array): Promise<string> {
        return this._isMyLedger()
            .then(() => LedgerAdapter._ledger.signSomeData(this._currentUser.id, bytes));
    }

    public getPrivateKey() {
        return Promise.reject('No private key');
    }

    protected _isMyLedger() {
        return LedgerAdapter._ledger.getUserDataById(this._currentUser.id)
            .then((user) => {
                if (user.address !== this._currentUser.address) {
                    throw {error: 'Invalid ledger'};
                }
            });
    }

    public static getUserList(from: Number = 1, to: Number = 1) {
        return LedgerAdapter._ledger.getPaginationUsersData(from, to);
    }

    public static initOptions(options: IEarthsLedger) {
        Adapter.initOptions(options);
        this._ledger = new EarthsLedger( options );
    }

    public static isAvailable() {
        if (!LedgerAdapter._hasConnectionPromise) {
            LedgerAdapter._hasConnectionPromise = LedgerAdapter._ledger.probeDevice();
        }

        return LedgerAdapter._hasConnectionPromise.then(() => {
            LedgerAdapter._hasConnectionPromise = null;
            return true;
        }, (err) => {
            LedgerAdapter._hasConnectionPromise = null;
            return false;
        });
    }
}

interface IEarthsLedger  {
    networkCode: number;
    debug?: boolean;
    openTimeout?: number;
    listenTimeout?: number;
    exchangeTimeout?: number;
    transport?;
}
