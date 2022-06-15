export const MISSING_KEY = '___MISSING_KEY___'
export const MISSING_TABLE_SERVICE = '___MISSING_TABLE_SERVICE___'

export type Table<T> = Readonly<Record<string, Readonly<T>>>

export type TableService<T> = {
    get(key: string): Promise<T>;
    set(key: string, val: T): Promise<void>;
    delete(key: string): Promise<void>;
}

// Q 2.1 (a)
export function makeTableService<T>(sync: (table?: Table<T>) => Promise<Table<T>>): TableService<T> {
    // optional initialization code
    return {
        get(key: string): Promise<T> {
            return new Promise(function (resolve, reject){
                sync()
                    .then(table=> {
                        if(key in table)
                            resolve(table[key]);
                        else
                            reject(MISSING_KEY);
                    })
                    .catch((err?: any) => {
                        reject(err);
                    })
            });
        },
        set(key: string, val: T): Promise<void> {
            return new Promise(function (resolve, reject){
                sync()
                    .then(table=>{
                        const modified_table: Record<string, Readonly<T>> = Object.assign({}, table)
                        modified_table[key] = val;
                        sync(modified_table)
                            .then(_ => resolve())
                            .catch((err) => reject(err))
                    })
                    .catch((err) => reject(err));
            });
        },
        delete(key: string): Promise<void> {
            return new Promise(function (resolve, reject){
                sync()
                    .then(table=>{
                        if (key in table) {
                            const modified_table: Record<string, Readonly<T>> = Object.assign({}, table)
                            delete modified_table[key]
                            sync(modified_table)
                                .then(_ => resolve())
                                .catch((err) => reject(err))
                        }else reject(MISSING_KEY);
                    })
                    .catch((err) => reject(err))
            });

        }
    }
}

// Q 2.1 (b)
export function getAll<T>(store: TableService<T>, keys: string[]): Promise<T[]> {
    const values: Promise<T>[] = []
    keys.map((key:string) => values.push(store.get(key)));
    return Promise.all(values)
}

// Q 2.2
export type Reference = { table: string, key: string }

export type TableServiceTable = Table<TableService<object>>

export function isReference<T>(obj: T | Reference): obj is Reference {
    return typeof obj === 'object' && 'table' in obj
}

export async function constructObjectFromTables(tables: TableServiceTable, ref: Reference) {
    async function deref(ref: Reference) {
        return Promise.reject('not implemented')
    }

    return deref(ref)
}

// Q 2.3

export function lazyProduct<T1, T2>(g1: () => Generator<T1>, g2: () => Generator<T2>): () => Generator<[T1, T2]> {
    return function* () {
        // TODO implement!
    }
}

export function lazyZip<T1, T2>(g1: () => Generator<T1>, g2: () => Generator<T2>): () => Generator<[T1, T2]> {
    return function* () {
        // TODO implement!
    }
}

// Q 2.4
export type ReactiveTableService<T> = {
    get(key: string): T;
    set(key: string, val: T): Promise<void>;
    delete(key: string): Promise<void>;
    subscribe(observer: (table: Table<T>) => void): void
}

export async function makeReactiveTableService<T>(sync: (table?: Table<T>) => Promise<Table<T>>, optimistic: boolean): Promise<ReactiveTableService<T>> {
    // optional initialization code

    let _table: Table<T> = await sync()

    const handleMutation = async (newTable: Table<T>) => {
        // TODO implement!
    }
    return {
        get(key: string): T {
            if (key in _table) {
                return _table[key]
            } else {
                throw MISSING_KEY
            }
        },
        set(key: string, val: T): Promise<void> {
            return handleMutation(null as any /* TODO */)
        },
        delete(key: string): Promise<void> {
            return handleMutation(null as any /* TODO */)
        },

        subscribe(observer: (table: Table<T>) => void): void {
            // TODO implement!
        }
    }
}