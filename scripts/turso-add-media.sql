-- Run once on Turso if you already created tables before this update:
-- turso db shell wedding-planner < scripts/turso-add-media.sql

ALTER TABLE VenueMedia ADD COLUMN blobUrl TEXT;

CREATE TABLE IF NOT EXISTS PlannerMedia (
    id TEXT NOT NULL PRIMARY KEY,
    plannerId TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'photo',
    storagePath TEXT NOT NULL DEFAULT '',
    blobUrl TEXT,
    originalName TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    sizeBytes INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PlannerMedia_plannerId_fkey FOREIGN KEY (plannerId) REFERENCES Planner (id) ON DELETE CASCADE ON UPDATE CASCADE
);
