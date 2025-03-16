import { getLastEventId, query, updateLastEventId } from '../util/pg-client'
import { getChanges, getDoc } from './get-couch-changes'

export async function syncMedical() {
  const lastEventId = await getLastEventId('medical')

  const changes = await getChanges(
    'medical',
    lastEventId[0]?.last_completed_sync
  )

  const filteredChanges = changes.data.results.filter(
    (change) =>
      change.doc.doctype === 'patients' ||
      change.doc.doctype === 'patients-data'
  )

  console.log(`medical :: found ${filteredChanges.length} changes`)

  for (const change of filteredChanges) {
    if (change.doc.doctype === 'patients') {
      await upsertPatient(change.doc as Patient)
      await updateLastEventId('medical', change.seq)
    } else if (change.doc.doctype === 'patients-data') {
      await upsertPatientData(change.doc as PatientData)
      await updateLastEventId('medical', change.seq)
    }
  }
  await updateLastEventId('medical', changes.data.last_seq)
  console.log(`medical :: ${filteredChanges.length} changes synced`)
}

interface Patient {
  _id: string
  documentType: string
  documentNumber: string
  fullName: string
  name: string
  secondName: string
  lastName: string
  secondLastName: string
  createdAt: string
  isDeleted: boolean
}

async function upsertPatient(patient: Patient) {
  // validate if exists and delete if exists
  const exist = await query(
    `SELECT * FROM patients WHERE id = '${patient._id}'`
  )

  if (exist.rows.length > 0) {
    await query(`DELETE FROM patients WHERE id = '${patient._id}'`)
  }

  const documentType = await getDoc('general', patient.documentType || '')
  await query(
    `
  INSERT INTO patients (
    id,
    is_deleted,
    document_type,
    document_number,
    full_name,
    name,
    second_name,
    last_name,
    second_last_name,
    created_at
  ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
  )
  `,
    [
      patient._id,
      patient.isDeleted,
      `${documentType.code} - ${documentType.name}`,
      patient.documentNumber,
      patient.fullName,
      patient.name,
      patient.secondName,
      patient.lastName,
      patient.secondLastName,
      patient.createdAt,
    ]
  )
}

interface PatientData {
  _id: string
  _rev: string
  doctype: string
  patientId: string
  birthDate: string
  maritalStatus: string
  bloodType: string
  eps: string
  epsAffiliationType: string
  arl: string
  schoolLevel: string
  biologicalSex: string
  gender: string
  applyPosition: string
  precedenceCity: string
  residenceCity: string
  residenceType: string
  residenceAddress: string
  residencePhone: string
  accompanyingName: string
  accompanyingParent: string
  accompanyingAddress: string
  responsibleName: string
  responsibleParent: string
  responsibleAddress: string
  signatureUrl: string
  fingerprintUrl: string
  photoUrl: string
  observation: string
  createdAt: string
  updatedAt: string
  updatedBy: string
  isDeleted: boolean
}

async function upsertPatientData(patientData: PatientData) {
  // validate if exists and delete if exists

  const exist = await query(
    `SELECT * FROM patients_data WHERE id = '${patientData._id}'`
  )

  if (exist.rows.length > 0) {
    await query(`DELETE FROM patients_data WHERE id = '${patientData._id}'`)
  }

  const position = await getDoc('general', patientData.applyPosition || '')
  const precedenceCity = await getDoc(
    'general',
    patientData.precedenceCity || ''
  )
  const residenceCity = await getDoc('general', patientData.residenceCity || '')

  await query(
    `
  INSERT INTO patients_data (
    id,
    is_deleted,
    birth_date,
    marital_status,
    blood_type,
    eps,
    eps_affiliation_type,
    arl,
    school_level,
    biological_sex,
    gender,
    apply_position,
    precedence_city,
    residence_city,
    residence_type,
    residence_address,
    residence_phone,
    accompanying_name,
    accompanying_parent,
    accompanying_address,
    responsible_name,
    responsible_parent,
    responsible_address,
    observation,
    signature_url,
    fingerprint_url,
    photo_url,
    created_at
  ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,
    $20,
    $21,
    $22,
    $23,
    $24,
    $25,
    $26,
    $27,
    $28
  )`,
    [
      patientData._id,
      patientData.isDeleted,
      patientData.birthDate,
      patientData.maritalStatus,
      patientData.bloodType,
      patientData.eps,
      patientData.epsAffiliationType,
      patientData.arl,
      patientData.schoolLevel,
      patientData.biologicalSex,
      patientData.gender,
      `${position.code} - ${position.name}`,
      `${precedenceCity.code} - ${precedenceCity.name}`,
      `${residenceCity.code} - ${residenceCity.name}`,
      patientData.residenceType,
      patientData.residenceAddress,
      patientData.residencePhone,
      patientData.accompanyingName,
      patientData.accompanyingParent,
      patientData.accompanyingAddress,
      patientData.responsibleName,
      patientData.responsibleParent,
      patientData.responsibleAddress,
      patientData.observation,
      patientData.signatureUrl,
      patientData.fingerprintUrl,
      patientData.photoUrl,
      patientData.createdAt,
    ]
  )
}
