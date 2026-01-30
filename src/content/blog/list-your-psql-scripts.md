---
title: "List Your psql Scripts"
description: "Organize and quickly access your PostgreSQL scripts from within psql using aliases and clever shell tricks."
pubDate: 2024-09-26
tags: ["postgresql", "bash", "database", "scripts", "productivity"]
draft: false
---

## Introduction

If you are a PostgreSQL database administrator like me where you operate many databases, it is a vital task to organize your sql-scripts in a way for easy lookup and execution. I have tons of scripts. How am I supposed to have them at hand when I need them? I need to lookup these scripts from within psql to stay focused. I will share with you my solution to this problem.

I need fast answers to all kinds of questions:

- Who is logged in? (w.sql)
- What queries are running? - active sessions (as.sql)
- Bloat, is vacuuming happening?
- Who has ingested the most data? schema size, database size

## Setting Up a PostgreSQL Server with Docker Compose

### Docker Compose Configuration

First, let's create a PostgreSQL server to work with:

```yaml
services:
  db:
    image: "postgres:latest"
    container_name: db
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: "root"
      POSTGRES_PASSWORD: "secret"
      POSTGRES_DB: "db"
    command: postgres -c shared_preload_libraries=pg_stat_statements -c pg_stat_statements.track=all
    volumes:
      - ./data:/var/lib/postgresql
```

### Starting the Service

Start the container in detached mode:

```bash
$ docker compose up -d
```

### Setting Environment Variables

For convenience, create an environment file:

```bash
$ cat env.sh
export PGHOST=localhost
export PGUSER=root
export PGPASSWORD=secret
export PGPORT=5432
export PGDATABASE=db
export PGOPTIONS=--search_path=public
```

Source it before connecting:

```bash
$ . env.sh
```

## Using the Script Listing Feature

Now let's demonstrate how to list and access scripts. First, connect to psql:

```bash
$ psql
```

### List Scripts by Name

Use the custom `:ls` command to filter scripts. For example, to find all scripts containing "size":

```sql
[localhost] root@db  =# \set f size
[localhost] root@db  =# :ls
/Users/BJBRA/projects/postgesql/psql/tablesize.sql
/Users/BJBRA/projects/postgesql/psql/tuplesize_by_page.sql
/Users/BJBRA/projects/postgesql/psql/dbsize.sql
/Users/BJBRA/projects/postgesql/psql/tablesize1.sql
/Users/BJBRA/projects/postgesql/psql/schemas_by_size.sql
/Users/BJBRA/projects/postgesql/psql/objectsize.sql
/Users/BJBRA/projects/postgesql/psql/tablesize_partitioned.sql
```

### Execute a Script

Now execute one of the scripts to see schema sizes:

```sql
[localhost] root@db  =# \i /Users/BJBRA/projects/postgesql/psql/schemas_by_size.sql
┌────────────────────┬─────────┐
│    table_schema    │ size_mb │
├────────────────────┼─────────┤
│ public             │  760.48 │
│ pg_catalog         │    7.53 │
│ information_schema │    0.24 │
└────────────────────┴─────────┘
(3 rows)
```

Or check database sizes:

```sql
[localhost] root@db  =# \i /Users/BJBRA/projects/postgesql/psql/dbsize.sql
┌───────────────┬────────────┐
│ database_name │ size_in_mb │
├───────────────┼────────────┤
│ db            │ 768 MB     │
│ template1     │ 7556 kB    │
│ postgres      │ 7492 kB    │
│ template0     │ 7337 kB    │
└───────────────┴────────────┘
(4 rows)
```

## How It Works

The magic happens with an alias in your `~/.psqlrc` file that points to the `ls.sql` script:

```
\set ls              '\i ~/projects/postgesql/psql/ls.sql'
```

### The ls.sql Script

Here's the complete `ls.sql` script that makes this work:

```sql
--------------------------------------------------------------------------------
-- name:    ls.sql
-- purpose: filter psql scripts from within the psql client.
-- author:  Bjarte Brandt
-- date:    01.11.2022
-- usage:   \set f <scriptname>
--          :ls
-- notes:
--   set variable 'f' and thereafter run ':ls'
--   all scripts: '\set f *'
--------------------------------------------------------------------------------

-- set session
\set QUIET yes
-- will turn both header and footer off
\pset tuples_only
\unset QUIET

-- variable concatenation in psql and output to file '_ls.sql'
\set c '\\! find ~/projects/postgesql/psql -maxdepth 1 -type f -name'
\set q '"'
\out _ls.sql
\qecho :c :q*:f*.sql:q
\out
-- now execute the generated '_ls.sql'
\i _ls.sql
-- cleanup
\! /bin/rm _ls.sql

-- restore session
\set QUIET yes
-- will turn both header and footer on
\pset tuples_only
\unset QUIET
```

### Important Notes

- Store all your scripts in a git repo (e.g., `~/projects/postgesql/psql/`)
- Adjust the `ls.sql` script to point the `find` command to your preferred directory
- Use `\set f *` to list all scripts

## Viewing Script Contents

You can also view script contents from within psql using a `:cat` command:

```sql
[localhost] root@db  =# \set c schemas_by_size
[localhost] root@db  =# :cat
select
  table_schema,
  round(sum(pg_total_relation_size(quote_ident(table_schema) || '.' || quote_ident(table_name)))::decimal / 1024 / 1024, 2) as size_mb
from
  information_schema.tables
group by
  table_schema
order by size_mb desc;
```

## Conclusion

This approach keeps your PostgreSQL management scripts organized and readily accessible without leaving the psql client. By using aliases and clever shell tricks, you can dramatically improve your workflow when managing multiple databases. Enjoy!
