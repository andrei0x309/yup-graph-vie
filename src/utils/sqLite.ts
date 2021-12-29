
const GRAPH_SNAPSHOTS_TABLE = 'graph_snapshots'
const DB_NAME = 'YUPGraph'

const MAIN_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS "${GRAPH_SNAPSHOTS_TABLE}" (
        "rowid" INTEGER NOT NULL,
        "user" TEXT NULL DEFAULT NULL,
        "graph_user_links" TEXT NULL DEFAULT NULL,
        "graph_user_analytics" TEXT NULL DEFAULT NULL,
        "collusion_score" REAL NULL DEFAULT NULL,
        "no_user_posts" REAL NULL DEFAULT NULL,
        "no_user_analytics_links" REAL NULL DEFAULT NULL,
        "date_created" DATETIME NULL DEFAULT NULL,
        PRIMARY KEY ("rowid")
    );
    `;

import { SQLiteDBConnection } from '@capacitor-community/sqlite';

async function deleteDatabase (db: SQLiteDBConnection): Promise<void> {
    try {
        const ret: any = await db.isExists();
        if (ret.result) {
            const dbName = db.getConnectionDBName();
            console.log("$$$ database " + dbName + " before delete");
            await db.delete();
            console.log("$$$ database " + dbName + " after delete " + ret.result);
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

export {
    DB_NAME,
    GRAPH_SNAPSHOTS_TABLE,
    MAIN_TABLE_QUERY,
    deleteDatabase
}