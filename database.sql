/*sql commands for postgres*/ 
CREATE DATABASE waters;


/*new updated table creation commands*/
CREATE TABLE stage(
  id SERIAL PRIMARY KEY,
  wave BIGINT,
  stage_location TEXT,
  no_of_pallets INTEGER,
  created_date DATE DEFAULT CURRENT_DATE,
  created_time TIME DEFAULT CURRENT_TIME,
  released boolean DEFAULT 'N',
  released_date DATE,
  released_time TIME
);

/*old table creation commands*/
CREATE TABLE stage(
  id SERIAL PRIMARY KEY,
  wave BIGINT,
  pack_hu TEXT UNIQUE,
  stage_location TEXT,
  no_of_pallets INTEGER,
  forwarder TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  created_time TIME DEFAULT CURRENT_TIME,
  released boolean DEFAULT 'N',
  released_date DATE,
  released_time TIME
);

/*change column name*/
ALTER TABLE stage 
RENAME COLUMN noOfPallets TO no_of_pallets;

/*change column to unique*/
ALTER TABLE stage
ADD CONSTRAINT 

/*add default value to released*/
ALTER TABLE stage ALTER COLUMN released SET DEFAULT 'N';

/*change multiple rows data in psql at one time*/
UPDATE stage
SET released = 't', 
 released_date = CURRENT_DATE,
 released_time = CURRENT_TIME
WHERE pack_hu in ('V00123456', 'V00123457');


UPDATE stage
SET released = 'f', 
 released_date = NULL,
 released_time = NULL
WHERE pack_hu in ('V00123456', 'V00123457');


/**change column type from INT to BIGINT because INT only allows number up till 2^31 -1 (2147483647)*/
ALTER TABLE stage ALTER COLUMN wave TYPE bigint


/**changes to the database*/
ALTER TABLE stage
DROP COLUMN pack_hu;

ALTER TABLE stage
DROP COLUMN forwarder;
