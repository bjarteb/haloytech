---
title: "PostgreSQL: Count Rows in All Tables in Schema"
description: "Use a CTE and psql's \\gexec to efficiently count rows across all tables in your PostgreSQL schema."
pubDate: 2024-08-30
tags: ["postgresql", "database", "sql"]
heroImage: "/storrinden-vinter-01.jpg"
draft: false
---

When working with PostgreSQL, you sometimes need to see how many rows are in each table within a schema. This query provides a clean way to get row counts for all tables at once.

## The Query

Use a Common Table Expression (CTE) to generate and execute dynamic SQL:

```sql
with x (y) as (
    select
      format('select %L as tablename, count(*) from %I ',
             tablename, tablename)
    from pg_tables
    where schemaname=current_schema()
)
select
    string_agg(y,' union all '||chr(10)) || ' order by tablename'
from x \gexec
```

## How It Works

1. **CTE generates SQL statements** - The `with x (y) as (...)` clause creates individual `SELECT` statements for each table
2. **format() ensures safety** - Uses `%L` for literals and `%I` for identifiers to prevent SQL injection
3. **string_agg() combines queries** - Joins all statements with `UNION ALL` and line breaks
4. **\gexec executes** - psql's `\gexec` metacommand runs the generated SQL

## Example Output

```
   tablename    | count
----------------+--------
 customers      |  1523
 orders         |  4891
 products       |   342
 users          |   789
Time: 234.567 ms
```

The results are sorted alphabetically by table name, showing the exact row count for each table.

## Switching Schemas

To run this on a different schema, set your search path first:

```sql
set search_path to myschema;
```

Then execute the main query.

## Performance Note

This will be an **expensive operation** if your dataset is large, as it performs an actual `COUNT(*)` on each table rather than using statistics.

For large databases, consider using `pg_stat_user_tables` for estimated counts instead:

```sql
SELECT
    schemaname,
    relname AS tablename,
    n_live_tup AS estimated_count
FROM pg_stat_user_tables
WHERE schemaname = current_schema()
ORDER BY relname;
```

This provides estimates based on statistics, which is much faster but less accurate.

## Use Cases

- **Data auditing** - Verify expected row counts across environments
- **Schema analysis** - Understand table sizes before migrations
- **Troubleshooting** - Identify empty or unexpectedly large tables
- **Documentation** - Generate table size reports

## Requirements

- PostgreSQL database
- Access to psql client (for `\gexec` metacommand)
- Read permissions on `pg_tables` system catalog

## Conclusion

This query provides a simple way to get accurate row counts for all tables in your current schema. While it can be slow on large datasets, it's invaluable for schema analysis and troubleshooting.

For frequent monitoring, consider using the statistics-based approach for better performance.
