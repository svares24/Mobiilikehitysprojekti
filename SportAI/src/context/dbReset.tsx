import React, { useState, createContext, useContext } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { createTables } from '../util/dbHelper';

const DbResetContext = createContext(() => {});

export const useDbReset = () => {
  const context = useContext(DbResetContext);
  return context;
};

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dbKey, setDbKey] = useState(0);

  const forceRefresh = () => setDbKey((prev) => prev + 1);

  return (
    <DbResetContext.Provider value={forceRefresh}>
      <SQLiteProvider
        key={dbKey}
        databaseName="route.db"
        onInit={createTables}
        onError={(e) => console.log(`DB error: ${e}`)}
      >
        {children}
      </SQLiteProvider>
    </DbResetContext.Provider>
  );
};
