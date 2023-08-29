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
    lastCompletedSync: {
      type: 'text',
      notNull: true,
    },
    createdAt: {
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
    contractName: {
      type: 'text',
      notNull: true,
    },
    contractCostCenter: {
      type: 'text',
      notNull: true,
    },
    contractSubsidiary: {
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
    patientId: {
      type: 'text',
      notNull: true,
    },
    patientDataId: {
      type: 'text',
      notNull: true,
    },
    patientIsNew: {
      type: 'boolean',
      notNull: true,
    },
    orderCycle: {
      type: 'jsonb',
    },
    services: {
      type: 'jsonb',
    },
    isDeleted: {
      type: 'boolean',
      notNull: true,
    },
  })

  pgm.createTable('patient', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    isDeleted: {
      type: 'boolean',
    },
    documentType: {
      type: 'text',
    },
    documentNumber: {
      type: 'text',
    },
    fullName: {
      type: 'text',
    },
    name: {
      type: 'text',
    },
    secondName: {
      type: 'text',
    },
    lastName: {
      type: 'text',
    },
    secondLastName: {
      type: 'text',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
    },
  })

  pgm.createTable('patient_data', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    isDeleted: {
      type: 'boolean',
      notNull: true,
    },
    birthDate: {
      type: 'text',
    },
    maritalStatus: {
      type: 'text',
    },
    bloodType: {
      type: 'text',
    },
    eps: {
      type: 'text',
    },
    epsAffiliationType: {
      type: 'text',
    },
    arl: {
      type: 'text',
    },
    schoolLevel: {
      type: 'text',
    },
    biologicalSex: {
      type: 'text',
    },
    gender: {
      type: 'text',
    },
    applyPosition: {
      type: 'text',
    },
    precedenceCity: {
      type: 'text',
    },
    residenceCity: {
      type: 'text',
    },
    residenceType: {
      type: 'text',
    },
    residenceAddress: {
      type: 'text',
    },
    residencePhone: {
      type: 'text',
    },
    accompanyingName: {
      type: 'text',
    },
    accompanyingParent: {
      type: 'text',
    },
    accompanyingAddress: {
      type: 'text',
    },
    responsibleName: {
      type: 'text',
    },
    responsibleParent: {
      type: 'text',
    },
    responsibleAddress: {
      type: 'text',
    },
    signatureUrl: {
      type: 'text',
    },
    fingerprintUrl: {
      type: 'text',
    },
    photoUrl: {
      type: 'text',
    },
    observation: {
      type: 'text',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
    },
  })

  pgm.createTable('annotation', {
    id: {
      type: 'text',
      notNull: true,
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    isDeleted: {
      type: 'boolean',
      notNull: true,
    },
    ticketId: {
      type: 'text',
      notNull: true,
    },
    serviceCode: {
      type: 'text',
    },
    serviceDescription: {
      type: 'text',
    },
    examCode: {
      type: 'text',
    },
    examDescription: {
      type: 'text',
    },
    examVersion: {
      type: 'text',
    },
    patientId: {
      type: 'text',
      notNull: true,
    },
    patientDataId: {
      type: 'text',
      notNull: true,
    },
    createAt: {
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
    annotationId: {
      type: 'text',
      notNull: true,
    },
    answer: {
      type: 'text',
    },
    fieldCode: {
      type: 'text',
    },
    fieldLabel: {
      type: 'text',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('sync_control', { ifExists: true })
  pgm.dropTable('tickets', { ifExists: true })
  pgm.dropTable('patient', { ifExists: true })
  pgm.dropTable('patient_data', { ifExists: true })
  pgm.dropTable('annotation', { ifExists: true })
  pgm.dropTable('annotation_answers', { ifExists: true })
}
