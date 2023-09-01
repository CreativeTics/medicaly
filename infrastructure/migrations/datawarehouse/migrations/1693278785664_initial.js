/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createExtension('uuid-ossp', { ifNotExists: true })

  pgm.createTable('sync_control', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    database: {
      type: 'text',
      notNull: true,
    },
    last_completed_sync: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  pgm.createTable('tickets', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    code: {
      type: 'text',
      notNull: true,
    },
    status: {
      type: 'text',
      notNull: true,
    },
    contract_name: {
      type: 'text',
      notNull: true,
    },
    contract_cost_center: {
      type: 'text',
      notNull: true,
    },
    contract_subsidiary: {
      type: 'text',
      notNull: true,
    },
    subsidiary: {
      type: 'text',
      notNull: true,
    },
    position: {
      type: 'text',
      notNull: true,
    },
    observation: {
      type: 'text',
      notNull: true,
    },
    patient_id: {
      type: 'text',
      notNull: true,
    },
    patient_data_id: {
      type: 'text',
      notNull: true,
    },
    patient_is_new: {
      type: 'boolean',
      notNull: true,
    },
    order_cycle: {
      type: 'jsonb',
    },
    services: {
      type: 'jsonb',
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
    },
  })

  pgm.createTable('patients', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    is_deleted: {
      type: 'boolean',
    },
    document_type: {
      type: 'text',
    },
    document_number: {
      type: 'text',
    },
    full_name: {
      type: 'text',
    },
    name: {
      type: 'text',
    },
    second_name: {
      type: 'text',
    },
    last_name: {
      type: 'text',
    },
    second_last_name: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
  })

  pgm.createTable('patients_data', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
    },
    birth_date: {
      type: 'text',
    },
    marital_status: {
      type: 'text',
    },
    blood_type: {
      type: 'text',
    },
    eps: {
      type: 'text',
    },
    eps_affiliation_type: {
      type: 'text',
    },
    arl: {
      type: 'text',
    },
    school_level: {
      type: 'text',
    },
    biological_sex: {
      type: 'text',
    },
    gender: {
      type: 'text',
    },
    apply_position: {
      type: 'text',
    },
    precedence_city: {
      type: 'text',
    },
    residence_city: {
      type: 'text',
    },
    residence_type: {
      type: 'text',
    },
    residence_address: {
      type: 'text',
    },
    residence_phone: {
      type: 'text',
    },
    accompanying_name: {
      type: 'text',
    },
    accompanying_parent: {
      type: 'text',
    },
    accompanying_address: {
      type: 'text',
    },
    responsible_name: {
      type: 'text',
    },
    responsible_parent: {
      type: 'text',
    },
    responsible_address: {
      type: 'text',
    },
    signature_url: {
      type: 'text',
    },
    fingerprint_url: {
      type: 'text',
    },
    photo_url: {
      type: 'text',
    },
    observation: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
  })

  pgm.createTable('annotations', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
    },
    ticket_id: {
      type: 'text',
      notNull: true,
    },
    service_code: {
      type: 'text',
    },
    service_description: {
      type: 'text',
    },
    exam_code: {
      type: 'text',
    },
    exam_description: {
      type: 'text',
    },
    exam_version: {
      type: 'text',
    },
    patient_id: {
      type: 'text',
      notNull: true,
    },
    patient_data_id: {
      type: 'text',
      notNull: true,
    },
    create_at: {
      type: 'timestamp',
      notNull: true,
    },
  })

  pgm.createTable('annotation_answers', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    annotation_id: {
      type: 'text',
      notNull: true,
    },
    answer: {
      type: 'text',
    },
    field_code: {
      type: 'text',
    },
    field_label: {
      type: 'text',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('sync_control', { ifExists: true })
  pgm.dropTable('tickets', { ifExists: true })
  pgm.dropTable('patients', { ifExists: true })
  pgm.dropTable('patients_data', { ifExists: true })
  pgm.dropTable('annotations', { ifExists: true })
  pgm.dropTable('annotation_answers', { ifExists: true })
}
