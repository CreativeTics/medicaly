/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql('SET search_path TO datawarehouse')
  pgm.sql(
    "INSERT INTO sync_control (database, last_completed_sync) VALUES ('general', ''), ('medical', '')",
  )
}

exports.down = (pgm) => {
  pgm.sql('SET search_path TO datawarehouse')
  pgm.sql("DELETE FROM sync_control WHERE database = 'general'")
  pgm.sql("DELETE FROM sync_control WHERE database = 'medical'")
}
