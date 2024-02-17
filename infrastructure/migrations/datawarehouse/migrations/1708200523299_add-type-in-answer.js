/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
        ALTER TABLE annotation_answers
        ADD COLUMN field_type text NOT NULL DEFAULT '';
    `)
}

exports.down = (pgm) => {
  pgm.sql(`
            ALTER TABLE annotation_answers
            DROP COLUMN field_type;
        `)
}
