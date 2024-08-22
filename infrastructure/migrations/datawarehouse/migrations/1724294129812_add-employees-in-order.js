/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
          ALTER TABLE tickets
          ADD COLUMN admitted_by jsonb  NULL DEFAULT '{}';
         
      `)
  pgm.sql(
    `ALTER TABLE tickets
            ADD COLUMN finalized_by jsonb  NULL DEFAULT '{}';
        `
  )
}

exports.down = (pgm) => {
  pgm.sql(`
              ALTER TABLE tickets
              DROP COLUMN admitted_by;
              
          `)
  pgm.sql(
    `ALTER TABLE tickets
              DROP COLUMN finalized_by;
          `
  )
}
