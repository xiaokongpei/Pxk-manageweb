import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * 用于管理用户私有 Firestore 数据的 Hook
 * 数据按用户ID隔离，支持实时同步
 */
export function useFirestoreState<T extends { id: string }>(
  collectionName: string,
  initialValue: T[]
) {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialValueRef = useRef(initialValue);

  // 监听 Firestore 数据变化
  useEffect(() => {
    // 重置状态
    setData([]);
    setLoading(true);
    setError(null);

    if (!user) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(db, 'users', user.uid, collectionName);
    let unsubscribe: Unsubscribe | null = null;
    let isMounted = true;

    try {
      unsubscribe = onSnapshot(
        collectionRef,
        { includeMetadataChanges: false },
        (snapshot) => {
          if (!isMounted) return;

          const items: T[] = [];
          snapshot.forEach((docSnapshot) => {
            items.push(docSnapshot.data() as T);
          });

          // 如果 Firestore 为空，使用初始值
          if (items.length === 0) {
            setData(initialValueRef.current);
            // 异步写入初始数据到 Firestore
            const init = async () => {
              try {
                const batch = writeBatch(db);
                initialValueRef.current.forEach((item) => {
                  const docRef = doc(db, 'users', user.uid, collectionName, item.id);
                  batch.set(docRef, item);
                });
                await batch.commit();
              } catch (err) {
                console.error('Failed to initialize data:', err);
              }
            };
            init();
          } else {
            setData(items);
          }

          setLoading(false);
        },
        (err) => {
          if (!isMounted) return;
          console.error('Firestore sync error:', err);
          setError(err);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Firestore subscribe error:', err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, collectionName]);

  // 添加或更新单个项目
  const setItem = useCallback(
    async (item: T) => {
      if (!user) return;

      const docRef = doc(db, 'users', user.uid, collectionName, item.id);
      try {
        await setDoc(docRef, item, { merge: true });
      } catch (err) {
        console.error('Firestore setItem error:', err);
        throw err;
      }
    },
    [user, collectionName]
  );

  // 删除单个项目
  const deleteItem = useCallback(
    async (id: string) => {
      if (!user) return;

      const docRef = doc(db, 'users', user.uid, collectionName, id);
      try {
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Firestore deleteItem error:', err);
        throw err;
      }
    },
    [user, collectionName]
  );

  // 批量设置所有数据
  const setAll = useCallback(
    async (items: T[]) => {
      if (!user) return;

      try {
        const batch = writeBatch(db);

        // 先获取当前所有文档并删除
        const collectionRef = collection(db, 'users', user.uid, collectionName);
        const { getDocs } = await import('firebase/firestore');
        const existingDocs = await getDocs(collectionRef);
        existingDocs.forEach((docSnapshot) => {
          batch.delete(docSnapshot.ref);
        });

        // 添加新数据
        items.forEach((item) => {
          const docRef = doc(db, 'users', user.uid, collectionName, item.id);
          batch.set(docRef, item);
        });

        await batch.commit();
      } catch (err) {
        console.error('Firestore setAll error:', err);
        throw err;
      }
    },
    [user, collectionName]
  );

  // 兼容原有 useState 风格的 setData
  const setDataWrapper = useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setData((prev) => {
        const newValue = typeof updater === 'function' ? updater(prev) : updater;

        // 异步同步到 Firestore
        if (user) {
          setAll(newValue).catch((err) => {
            console.error('Failed to sync to Firestore:', err);
          });
        }

        return newValue;
      });
    },
    [user, setAll]
  );

  return {
    data,
    setData: setDataWrapper,
    setItem,
    deleteItem,
    setAll,
    loading,
    error,
  };
}
