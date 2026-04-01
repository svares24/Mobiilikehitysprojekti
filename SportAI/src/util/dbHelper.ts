import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { Coords, Point, Route } from '../types';
import { getDuration, getTotalDistance } from './coordCalculations';

export const createTables = async (db: SQLiteDatabase) => {
  //quick version check for when schema changes
  const version = 1;
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS version (id INTEGER PRIMARY KEY AUTOINCREMENT, v INTEGER NOT NULL);'
  );
  const result = await db.sql<{
    id: number;
    v: number;
  }>`SELECT * FROM version;`;
  if (!result[0] || result[0].v != version) {
    await db.execAsync('DROP TABLE IF EXISTS route;');
    await db.execAsync('DROP TABLE IF EXISTS point;');
  }

  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS route (route_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, distance REAL NOT NULL, duration INTEGER NOT NULL, created DATE NOT NULL);'
  );
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS point (point_id INTEGER PRIMARY KEY AUTOINCREMENT, route_id INTEGER NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL, alt REAL NOT NULL, time INTEGER NOT NULL, FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE);'
  );
  await db.sql`INSERT OR REPLACE INTO version (id,v) VALUES (1,${version});`;
};

export const addCompleteRoute = async (
  db: SQLiteDatabase,
  name: string,
  coordinates: Coords[]
) => {
  await db.withTransactionAsync(async () => {
    const distance = getTotalDistance(coordinates);
    const duration = getDuration(coordinates);
    const created = coordinates[coordinates.length - 1].time;

    const routeResult =
      (await db.sql`INSERT INTO route (name,distance,duration,created) VALUES (${name},${distance},${duration},${created.getTime()});`) as SQLiteRunResult;

    const id = routeResult.lastInsertRowId;

    await Promise.all(
      coordinates.map(
        (coordinate) =>
          db.sql`INSERT INTO point (route_id,lat,lon,alt,time) VALUES (${id},${coordinate.lat},${coordinate.lon},${coordinate.alt},${coordinate.time.getTime()});`
      )
    );
  });
};

/* export const addRoute = async (db: SQLiteDatabase, name: string) => {
  await db.runAsync('INSERT INTO route (name) VALUES (?);', [name]);
}; */

export const getRoutes = async (db: SQLiteDatabase): Promise<Route[]> => {
  const result = await db.sql<Route>`SELECT * FROM route ORDER BY created;`;
  return result;
};

export const getRoute = async (
  db: SQLiteDatabase,
  id: number
): Promise<Route> => {
  const result =
    await db.sql<Route>`SELECT * FROM route WHERE route_id == ${id};`;
  return result[0];
};

export const changeRouteName = async (
  db: SQLiteDatabase,
  id: number,
  name: string
) => {
  await db.sql`UPDATE route SET name = ${name} WHERE route_id = ${id};`;
};

export const deleteRoute = async (db: SQLiteDatabase, id: number) => {
  await db.sql`DELETE FROM route WHERE route_id = ${id};`;
};

export const getAllPoints = async (db: SQLiteDatabase): Promise<Point[]> => {
  const result = await db.sql<Point>`SELECT * FROM point ORDER BY time;`;
  return result;
};

export const getPoints = async (
  db: SQLiteDatabase,
  route_id: number
): Promise<Point[]> => {
  const result =
    await db.sql<Point>`SELECT * FROM point WHERE route_id == ${route_id} ORDER BY time;`;
  return result;
};

export const getRoutesByDate = async (
  db: SQLiteDatabase,
  dateString: string
): Promise<Route[]> => {
  const start = new Date(dateString);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateString);
  end.setHours(23, 59, 59, 999);

  const result = await db.sql<Route>`
    SELECT * FROM route WHERE created >= ${start.getTime()} AND created <= ${end.getTime()} ORDER BY created;`;
  return result;
};