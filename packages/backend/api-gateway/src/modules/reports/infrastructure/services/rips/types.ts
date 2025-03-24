// Transacción	T01	numDocumentoIdObligado	Cadena	9	Dato obligatorio	Tamaño Fijo	Admite únicamente 9 caracteres
// Transacción	T02	numFactura			Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o debe cumplir con Resolución DIAN
// Transacción	T03	tipoNota	Cadena	0,2	Dato no obligatorio	Tamaño Fijo o nulo	Admite campo nulo (null) o únicamente 2 caracteres
// Transacción	T04	numNota	Cadena	0-20	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o hasta 20 caracteres
export type RipsTransaction = {
  numDocumentoIdObligado: string
  numFactura: string | null
  tipoNota: string | null
  numNota: string | null
  usuarios: RipsUsuario[]
}

// Usuarios	U02	numDocumentoIdentificacion	Cadena	4-20	Dato obligatorio	Tamaño Variable sin nulo	Admite de 4 a 20 caracteres
// Usuarios	U03	tipoUsuario	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Usuarios	U04	fechaNacimiento	Cadena	10	Dato obligatorio	Tamaño Fijo	Admite únicamente 10 caracteres
// Usuarios	U05	codSexo	Cadena	1	Dato obligatorio	Tamaño Fijo	Admite únicamente 1 caracter
// Usuarios	U06	codPaisResidencia	Cadena	3	Dato obligatorio	Tamaño Fijo	Admite únicamente 3 caracteres
// Usuarios	U07	codMunicipioResidencia	Cadena	0, 5	Dato no obligatorio	Tamaño Fijo o nulo	Admite campo nulo (null) o únicamente 5 caracteres
// Usuarios	U08	codZonaTerritorialResidencia	Cadena	0, 2	Dato no obligatorio	Tamaño Fijo o nulo	Admite campo nulo (null) o únicamente 2 caracteres
// Usuarios	U09	incapacidad	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Usuarios	U10	consecutivo	Numérico	1-7	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 7 dígitos
// Usuarios	U11	codPaisOrigen	Cadena	3	Dato obligatorio	Tamaño Fijo	Admite únicamente 3 caracteres

export type RipsUsuario = {
  tipoDocumentoldentificacion: string
  numDocumentoIdentificacion: string
  tipoUsuario: string
  fechaNacimiento: string
  codSexo: string
  codPaisResidencia: string
  codMunicipioResidencia: string | null
  codZonaTerritorialResidencia: string | null
  incapacidad: string
  consecutivo: number
  codPaisOrigen: string
  servicios: {
    consultas: RipsConsulta[]
    procedimientos: RipsProcedimiento[]
    urgencias: []
    hospitalizacion: []
    recienNacidos: []
    medicamentos: []
    otrosServicios: []
  }
}

// consultas	C02	fechaInicioAtencion	Cadena	16	Dato obligatorio	Tamaño Fijo	Admite únicamente 16 caracteres
// consultas	C03	numAutorizacion	Cadena	0-30	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o hasta 30 caracteres
// consultas	C04	codConsulta	Cadena	6	Dato obligatorio	Tamaño Fijo	Admite únicamente 6 caracteres
// consultas	C05	modalidadGrupoServicioTecSal	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C06	grupoServicios	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C07	codServicio	Numérico	3, 4	Dato obligatorio	Tamaño Variable sin nulo	Admite únicamente 3 o 4 dígitos
// consultas	C08	finalidadTecnologiaSalud	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C09	causaMotivoAtencion	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C10	codDiagnosticoPrincipal	Cadena	4-25	Dato obligatorio	Tamaño Variable sin nulo	Admite de 4 a 25 caracteres
// consultas	C11	codDiagnosticoRelacionado1	Cadena	0, 4-25	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o de 4 a 25 caracteres
// consultas	C12	codDiagnosticoRelacionado2	Cadena	0, 4-25	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o de 4 a 25 caracteres
// consultas	C13	codDiagnosticoRelacionado3	Cadena	0, 4-25	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o de 4 a 25 caracteres
// consultas	C14	tipoDiagnosticoPrincipal	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C15	tipoDocumentoIdentificacion	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C16	numDocumentoIdentificacion	Cadena	4-20	Dato obligatorio	Tamaño Variable sin nulo	Admite de 4 a 20 caracteres
// consultas	C17	vrServicio	Numérico	1-10	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 10 dígitos
// consultas	C18	conceptoRecaudo	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// consultas	C19	valorPagoModerador	Numérico	1-10	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 10 dígitos
// consultas	C20	numFEVPagoModerador			Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o debe cumplir con Resolución DIAN
// consultas	C21	consecutivo	Numérico	1-7	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 7 dígitos

export type RipsConsulta = {
  fechaInicioAtencion: string
  numAutorizacion: string | null
  codConsulta: string
  modalidadGrupoServicioTecSal: string
  grupoServicios: string
  codServicio: number
  finalidadTecnologiaSalud: string
  causaMotivoAtencion: string
  codDiagnosticoPrincipal: string
  codDiagnosticoRelacionado1: string | null
  codDiagnosticoRelacionado2: string | null
  codDiagnosticoRelacionado3: string | null
  tipoDiagnosticoPrincipal: string
  tipoDocumentoIdentificacion: string
  numDocumentoIdentificacion: string
  vrServicio: number
  conceptoRecaudo: string
  valorPagoModerador: number
  numFEVPagoModerador: string | null
  consecutivo: number
}

// Procedimientos	P01	codPrestador	Cadena	12	Dato obligatorio	Tamaño Fijo	Admite únicamente 12 caracteres
// Procedimientos	P02	fechaInicioAtencion	Cadena	16	Dato obligatorio	Tamaño Fijo	Admite únicamente 16 caracteres
// Procedimientos	P03	idMIPRES	Cadena	0-15	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o hasta 15 caracteres
// Procedimientos	P04	numAutorizacion	Cadena	0-30	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o hasta 30 caracteres
// Procedimientos	P05	codProcedimiento	Cadena	6	Dato obligatorio	Tamaño Fijo	Admite únicamente 6 caracteres
// Procedimientos	P06	viaIngresoServicioSalud	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P07	modalidadGrupoServicioTecSal	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P08	grupoServicios	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P09	codServicio	Numérico	3,4	Dato obligatorio	Tamaño Variable sin nulo	Admite únicamente 3 o 4 dígitos
// Procedimientos	P10	finalidadTecnologiaSalud	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P11	tipoDocumentoIdentificacion	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P12	numDocumentoIdentificacion	Cadena	4-20	Dato obligatorio	Tamaño Variable sin nulo	Admite de 4 a 20 caracteres
// Procedimientos	P13	codDiagnosticoPrincipal	Cadena	4-25	Dato obligatorio	Tamaño Variable sin nulo	Admite de 4 a 25 caracteres
// Procedimientos	P14	codDiagnosticoRelacionado	Cadena	0, 4-25	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o de 4 a 25 caracteres
// Procedimientos	P15	codComplicacion	Cadena	0, 4-25	Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o de 4 a 25 caracteres
// Procedimientos	P16	vrServicio	Numérico	1-15	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 15 dígitos
// Procedimientos	P17	conceptoRecaudo	Cadena	2	Dato obligatorio	Tamaño Fijo	Admite únicamente 2 caracteres
// Procedimientos	P18	valorPagoModerador	Numérico	1-10	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 10 dígitos
// Procedimientos	P19	numFEVPagoModerador			Dato no obligatorio	Tamaño variable con nulo	Admite campo nulo (null) o debe cumplir con Resolución DIAN
// Procedimientos	P20	consecutivo	Numérico	1-7	Dato obligatorio	Tamaño Variable sin nulo	Admite de 1 a 7 dígitos

export type RipsProcedimiento = {
  codPrestador: string
  fechaInicioAtencion: string
  idMIPRES: string | null
  numAutorizacion: string | null
  codProcedimiento: string
  viaIngresoServicioSalud: string
  modalidadGrupoServicioTecSal: string
  grupoServicios: string
  codServicio: number
  finalidadTecnologiaSalud: string
  tipoDocumentoIdentificacion: string
  numDocumentoIdentificacion: string
  codDiagnosticoPrincipal: string
  codDiagnosticoRelacionado: string | null
  codComplicacion: string | null
  vrServicio: number
  conceptoRecaudo: string
  valorPagoModerador: number
  numFEVPagoModerador: string | null
  consecutivo: number
}
