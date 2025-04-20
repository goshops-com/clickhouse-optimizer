const QUERIES = {
  QUERY_PERFORMANCE: `
    SELECT 
      user,
      client_hostname,
      query_duration_ms,
      memory_usage,
      read_rows,
      read_bytes,
      written_rows,
      written_bytes,
      result_rows,
      result_bytes,
      query
    FROM system.query_log
    WHERE type = 'QueryFinish'
    ORDER BY query_duration_ms DESC
    LIMIT 20
  `,
  
  STORAGE_BY_TABLE: `
    SELECT
      database,
      table,
      formatReadableSize(sum(bytes)) AS size,
      sum(rows) AS rows,
      max(modification_time) AS latest_modification,
      sum(bytes) AS bytes_raw
    FROM system.parts
    WHERE active
    GROUP BY database, table
    ORDER BY bytes_raw DESC
  `,
  
  DISK_USAGE_BY_DB: `
    SELECT
      database,
      formatReadableSize(sum(bytes)) AS size,
      sum(rows) AS rows,
      count() AS part_count
    FROM system.parts
    WHERE active
    GROUP BY database
    ORDER BY sum(bytes) DESC
  `,
  
  PART_LEVEL_STORAGE: `
    SELECT
      database,
      table,
      partition,
      name AS part_name,
      rows,
      formatReadableSize(bytes) AS size,
      formatReadableSize(primary_key_bytes_in_memory) AS primary_key_size,
      formatReadableSize(bytes_on_disk) AS disk_size,
      compression_ratio,
      bytes_uncompressed
    FROM system.parts
    WHERE active
    ORDER BY bytes DESC
    LIMIT 20
  `,
  
  MEMORY_USAGE: `
    SELECT
      metric,
      value,
      formatReadableSize(value) AS formatted_value
    FROM system.metrics
    WHERE metric LIKE '%Memory%'
    ORDER BY value DESC
  `,
  
  MERGE_PROCESS_INFO: `
    SELECT *
    FROM system.merges
    ORDER BY elapsed DESC
  `,
  
  ACTIVE_QUERIES: `
    SELECT
      query_id,
      user,
      query,
      elapsed,
      read_rows,
      read_bytes,
      memory_usage
    FROM system.processes
    ORDER BY elapsed DESC
  `,
  
  REPLICATION_STATUS: `
    SELECT
      database,
      table,
      is_leader,
      is_readonly,
      absolute_delay
    FROM system.replicas
    ORDER BY absolute_delay DESC
  `,
  
  SLOW_LOG_ANALYSIS: `
    SELECT
      type,
      event_time,
      query_duration_ms,
      query_kind,
      query,
      exception
    FROM system.query_log
    WHERE (query_duration_ms > 1000) AND (type = 'QueryFinish' OR type = 'ExceptionWhileProcessing')
    ORDER BY event_time DESC
    LIMIT 50
  `
};

module.exports = QUERIES; 