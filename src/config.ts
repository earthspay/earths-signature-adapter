import { SeedAdapter } from './adapters/SeedAdapter';
import { LedgerAdapter } from './adapters/LedgerAdapter';
import { EarthsKeeperAdapter } from './adapters';

export const enum AdapterType {
    Seed = 'seed',
    EarthsKeeper = 'earthsKeeper',
    Ledger = 'ledger',
    Tresor = 'tresor'
}

export const adapterPriorityList = [
    AdapterType.EarthsKeeper,
    AdapterType.Ledger,
    AdapterType.Tresor,
    AdapterType.Seed
];

export const adapterList = [
    SeedAdapter,
    LedgerAdapter,
    EarthsKeeperAdapter
];
