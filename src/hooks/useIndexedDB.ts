import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseIndexedDBOptions {
  dbName: string;
  storeName: string;
  version?: number;
}

export type IndexedDBStatus = 'idle' | 'opening' | 'ready' | 'error';

export interface UseIndexedDBReturn<T> {
  status: IndexedDBStatus;
  error: Error | null;
  getItem: (key: IDBValidKey) => Promise<T | undefined>;
  setItem: (key: IDBValidKey, value: T) => Promise<void>;
  removeItem: (key: IDBValidKey) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<IDBValidKey[]>;
}

/**
 * IndexedDB CRUD를 React 훅으로 추상화합니다.
 * @param options dbName, storeName, version 설정
 * @returns CRUD 메서드와 상태
 */
export function useIndexedDB<T = unknown>({
  dbName,
  storeName,
  version = 1,
}: UseIndexedDBOptions): UseIndexedDBReturn<T> {
  const [status, setStatus] = useState<IndexedDBStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const dbRef = useRef<IDBDatabase | null>(null);

  useEffect(() => {
    setStatus('opening');

    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = (event) => {
      dbRef.current = (event.target as IDBOpenDBRequest).result;
      setStatus('ready');
    };

    request.onerror = (event) => {
      const err = (event.target as IDBOpenDBRequest).error;
      setError(err ?? new Error('IndexedDB open failed'));
      setStatus('error');
    };

    return () => {
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, [dbName, storeName, version]);

  const withStore = useCallback(
    <R>(
      mode: IDBTransactionMode,
      operation: (store: IDBObjectStore) => IDBRequest<R>,
    ): Promise<R> => {
      return new Promise((resolve, reject) => {
        if (!dbRef.current) {
          reject(new Error('IndexedDB is not ready'));
          return;
        }

        const tx = dbRef.current.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error('IndexedDB operation failed'));

        // 트랜잭션 레벨 오류 처리 (QuotaExceededError 등)
        tx.onerror = () =>
          reject(tx.error ?? new Error('IndexedDB transaction failed'));
        tx.onabort = () =>
          reject(tx.error ?? new Error('IndexedDB transaction aborted'));
      });
    },
    [storeName],
  );

  const getItem = useCallback(
    (key: IDBValidKey) => withStore<T | undefined>('readonly', (store) => store.get(key)),
    [withStore],
  );

  const setItem = useCallback(
    (key: IDBValidKey, value: T) =>
      withStore<IDBValidKey>('readwrite', (store) => store.put(value, key)).then(() => {}),
    [withStore],
  );

  const removeItem = useCallback(
    (key: IDBValidKey) =>
      withStore<undefined>('readwrite', (store) => store.delete(key)).then(() => {}),
    [withStore],
  );

  const clear = useCallback(
    () => withStore<undefined>('readwrite', (store) => store.clear()).then(() => {}),
    [withStore],
  );

  const getAllKeys = useCallback(
    () => withStore<IDBValidKey[]>('readonly', (store) => store.getAllKeys()),
    [withStore],
  );

  return { status, error, getItem, setItem, removeItem, clear, getAllKeys };
}
