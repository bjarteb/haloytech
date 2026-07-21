---
title: "Connect to Oracle Database with JavaScript"
description: "Organize and quickly access your PostgreSQL scripts from within psql using aliases and clever shell tricks."
pubDate: 2026-07-21
tags: ["oracle", "javascript", "database", "scripts", "productivity"]
heroImage: "/storrinden-nedfall-02.jpg"
draft: false
---

## Introduction

Let us connect to Oracle AI Database 26ai using JavaScript/TypeScript
We will make use of the 

## Setting Up a Oracle Database with Docker Compose

### Docker Compose Configuration

First, let's create a Oracle Database server to work with:

```yaml
services:
  oracle:
    image: gvenzl/oracle-free:slim-faststart
    container_name: db
    hostname: db
    ports:
      - "1521:1521"
    environment:
      ORACLE_PASSWORD: Welcome12345
      APP_USER: dev
      APP_USER_PASSWORD: dev
    volumes:
      - ./init_scripts:/container-entrypoint-initdb.d
```

We have mounted a init_scripts directory where it's content will be run after database startup
This is what will happen:
* Download install.sql file using curl
* Set TWO_TASK=//localhost:1521/FREEPDB1 (1521 is default and can be left out). TWO_TASK is an old friend
  I always set so I easily can switch between accounts (user/pass) without specifying the host:[port]/SERVICE_NAME part.  
* Login to the database with the dev account specified in the docker-compose.yml file
* Run the install.sql script
* Cleanup (delete the install.sql)


```bash
tree init_scripts
init_scripts
└── 01_install.sh

cat init_scripts/01_install.sh
curl -LJO https://raw.githubusercontent.com/gvenzl/sample-data/master/countries-cities-currencies/install.sql
TWO_TASK=//localhost/FREEPDB1 sqlplus -s dev/dev @install.sql
rm install.sql
```

Start the database container in detached mode:

```bash
$ docker compose up -d
```

Verify:

```bash
docker compose ps
NAME      IMAGE                               COMMAND                  SERVICE   CREATED          STATUS          PORTS
db        gvenzl/oracle-free:slim-faststart   "container-entrypoin…"   oracle    11 minutes ago   Up 11 minutes   0.0.0.0:1521->1521/tcp, [::]:1521->1521/tcp
```

Let's make sure the tables have been created
* set TWO_TASK
* Login using the SQLcl client (brew install sqlcl. GraalVM for JavaScript engine to configure fanzy prompt).
* List tables using SQLcl alias. SQLcl has an alias for everything. No need to query the catalog by hand.

```bash
export TWO_TASK=localhost/FREEPDB1
sql dev/dev
SQLcl: Release 26.2 Production on Tue Jul 21 08:56:11 2026

Copyright (c) 1982, 2026, Oracle.  All rights reserved.

Connected to:
Oracle AI Database 26ai Free Release 23.26.2.0.0 - Develop, Learn, and Run for Free
Version 23.26.2.0.0

DEV@FREEPDB1🙊😎 > alias groups
apex      default   my        nucleo    ords      psql      report    system
DEV@FREEPDB1🙊😎 > alias default
functions       indexes         locks           mview_logs      mviews          oraversion      packages        procedures      queues          schedules       sequences
sessions        synonyms        tables          triggers        types           u_jobs          u_mle_modules   views

DEV@FREEPDB1🙊😎 > tables

TABLES
--------------------------------------------------------------------------------------------------------------------------------
CITIES
COUNTRIES
CURRENCIES
CURRENCIES_COUNTRIES
REGIONS
```

## It is time to query our Oracle Database using Javascript


### Create a typescript project

```bash
# one-liner to configure a modern typescript project
npm init -y && jq '. + {type: "module"}' package.json > tmp.json && mv -fv tmp.json package.json && npm install -D typescript @types/node && npx tsc --init
# we will load the environment variables from a .env file
npm i dotenv
```

### Install the Oracle Database JavaScript module

```bash
npm search oracledb
oracledb
A Node.js module for Oracle Database access from JavaScript and TypeScript
Version 7.0.1 published 2026-07-15 by sharadchan87
Maintainers: krismohan anthony.tuininga sharadchan87
Keywords: Oracle Database official DB SQL JSON PL/SQL SODA OCI API client library driver add-on extension binding interface adapter module
https://npm.im/oracledb

npm i oracledb
```

### Configure the environment

```bash
cat .env
DB_USERNAME=dev
DB_PASSWORD=dev
DB_CONNECTION_STRING=localhost/FREEPDB1
```

### Query the COUNTRIES table

```bash
node countries.ts
◇ injected env (3) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
Successfully connected to Oracle Database
AD Andorra Principality of Andorra 86000
AE United Arab Emirates United Arab Emirates 9701000
AF Afghanistan Islamic Republic of Afghanistan 34941000
AG Antigua and Barbuda Antigua and Barbuda 96000
AL Albania Republic of Albania 3057000
AM Armenia Republic of Armenia 3038000
AO Angola Republic of Angola 30356000
etc ...
```

### The countries.ts script

```typescript
import oracledb, { Connection } from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

interface CountryRow {
  COUNTRY_CODE: string;
  NAME: string;
  OFFICIAL_NAME: string;
  POPULATION: number;
}

async function runApp(): Promise<void> {
  let connection: Connection | undefined;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING
    });
    console.log("Successfully connected to Oracle Database");

    const queryResult = await connection.execute<CountryRow>(
      `select country_code, name, official_name, population from countries`,
      [],
      { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const rs = queryResult.resultSet!;
    let row: CountryRow | undefined;
    while ((row = await rs.getRow())) {
      if (row.OFFICIAL_NAME === null) {
        console.log(row.COUNTRY_CODE, row.NAME, row.NAME, row.POPULATION);
      }
      else {
        console.log(row.COUNTRY_CODE, row.NAME, row.OFFICIAL_NAME, row.POPULATION);
      }
    }
    await rs.close();
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
runApp();
```

