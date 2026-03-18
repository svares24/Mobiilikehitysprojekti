import * as SQLite from 'expo-sqlite';

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS route (route_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);'
  );
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS point (point_id INTEGER PRIMARY KEY AUTOINCREMENT, route_id NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, time INTEGER NOT NULL, FOREIGN KEY (route_id) REFERENCES route(route_id));'
  );
};

export interface Point {
  point_id: number;
  route_id: number;
  lat: number;
  lon: number;
  time: Date;
}
export interface Route {
  route_id: number;
  name: string;
}

export const addRoute = async (db: SQLite.SQLiteDatabase, name: string) => {
  await db.runAsync('INSERT INTO route (name) VALUES (?);', [name]);
};

export const getRoutes = async (
  db: SQLite.SQLiteDatabase
): Promise<Route[]> => {
  const result: Route[] = await db.getAllAsync('SELECT * FROM route;');
  return result;
};
