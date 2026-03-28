# Guia para crear Formularios Dinamicos

Esta guia explica como armar el JSON (schema) que define un formulario dinamico en la plataforma. No necesitas conocer el codigo fuente: solo arma el JSON siguiendo las indicaciones de cada seccion.

---

## 1. Estructura general del formulario

Un formulario se organiza en **grupos**, y cada grupo contiene **campos**. El JSON tiene esta forma:

```json
{
  "groups": [
    {
      "name": "Nombre del grupo",
      "description": "Descripcion opcional que aparece debajo del titulo",
      "fields": [
        { ... campo 1 ... },
        { ... campo 2 ... }
      ]
    },
    {
      "name": "Otro grupo",
      "fields": [ ... ]
    }
  ]
}
```

Cada grupo se muestra visualmente como una seccion con titulo. Puedes tener tantos grupos como necesites.

---

## 2. Propiedades generales de un campo

Todos los campos comparten estas propiedades:

| Propiedad | Obligatoria | Descripcion |
|-----------|:-----------:|-------------|
| `name` | Si | Nombre unico del campo. Es la clave con la que se guarda el valor. Debe ser unico en todo el formulario. |
| `type` | Si | Tipo de campo (ver seccion 3). |
| `label` | No | Etiqueta que se muestra encima del campo. |
| `props` | No | Configuracion visual y de comportamiento del campo (placeholder, ancho, opciones, etc). |
| `rules` | No | Lista de validaciones que debe cumplir el campo (ver seccion 4). |
| `default` | No | Valor que tendra el campo al cargar el formulario. |
| `if` | No | Condicion para mostrar u ocultar el campo (ver seccion 5). |
| `editingProps` | No | Configuracion adicional que se aplica solo cuando se esta editando un registro existente. |
| `query` | No | Permite cargar opciones desde el servidor en campos de seleccion. |
| `dependsOn` | No | Hace que las opciones del campo se recarguen cuando otro campo cambia (ver seccion 6). |

---

## 3. Tipos de campo

### 3.1 `text` - Texto

Campo para ingresar texto libre en una sola linea.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda que aparece cuando el campo esta vacio |
| `class` | Ancho del campo (ver seccion 7) |
| `disabled` | `true` para deshabilitar el campo |

**Reglas de validacion compatibles:** `required`, `email`, `url`, `upper`, `alphanumeric`, `onlyletters`, `minlength`, `maxlength`, `pattern`

**Ejemplo:**

```json
{
  "name": "nombre_paciente",
  "label": "Nombre del paciente",
  "type": "text",
  "props": {
    "placeholder": "Ingrese el nombre completo",
    "class": "col-span-2"
  },
  "rules": ["required", "onlyletters", "maxlength:100"]
}
```

---

### 3.2 `number` - Numero

Campo para ingresar valores numericos.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |

**Reglas de validacion compatibles:** `required`, `number`, `positive`, `integer`, `decimal`, `min`, `max`, `between`

**Ejemplo:**

```json
{
  "name": "edad",
  "label": "Edad",
  "type": "number",
  "props": {
    "placeholder": "0",
    "class": "col-span-2"
  },
  "rules": ["required", "number", "min:0", "max:150"]
}
```

---

### 3.3 `check` - Si / No (Toggle)

Interruptor que permite activar o desactivar una opcion. Su valor es `true` o `false`.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `class` | Ancho del campo |

**Reglas de validacion compatibles:** `required-check` (obliga a que este activado)

**Ejemplo:**

```json
{
  "name": "acepta_terminos",
  "label": "Acepta terminos y condiciones",
  "type": "check",
  "props": { "class": "col-span-2" },
  "rules": ["required-check"]
}
```

---

### 3.4 `date` - Fecha

Campo para seleccionar una fecha.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |

**Reglas de validacion compatibles:** `required`, `date`, `before`

**Ejemplo:**

```json
{
  "name": "fecha_nacimiento",
  "label": "Fecha de nacimiento",
  "type": "date",
  "props": {
    "placeholder": "Seleccione fecha",
    "class": "col-span-2"
  },
  "rules": ["required", "date"]
}
```

**Ejemplo con rango (fecha fin debe ser posterior a fecha inicio):**

```json
[
  {
    "name": "fecha_inicio",
    "label": "Fecha inicio",
    "type": "date",
    "rules": ["required", "date"]
  },
  {
    "name": "fecha_fin",
    "label": "Fecha fin",
    "type": "date",
    "rules": ["required", "date", "before:$fecha_inicio"]
  }
]
```

---

### 3.5 `select` - Lista desplegable (seleccion unica)

Permite elegir UNA opcion de una lista con buscador.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |
| `options` | Lista de opciones. Cada opcion tiene `id` (valor que se guarda) y `name` (texto que se muestra) |

**Reglas de validacion compatibles:** `required`

**Ejemplo con opciones fijas:**

```json
{
  "name": "genero",
  "label": "Genero",
  "type": "select",
  "props": {
    "placeholder": "Seleccione",
    "class": "col-span-2",
    "options": [
      { "id": "M", "name": "Masculino" },
      { "id": "F", "name": "Femenino" }
    ]
  },
  "rules": ["required"]
}
```

**Ejemplo con opciones desde el servidor:**

```json
{
  "name": "ciudad",
  "label": "Ciudad",
  "type": "select",
  "props": {
    "placeholder": "Seleccione ciudad",
    "class": "col-span-2"
  },
  "query": {
    "entity": "cities",
    "label": "name",
    "value": "id"
  },
  "rules": ["required"]
}
```

---

### 3.6 `simple_multiselect` - Seleccion multiple simple (chips)

Permite elegir VARIAS opciones que se muestran como etiquetas (chips).

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `required` | Muestra indicador visual de obligatorio |
| `options` | Lista de opciones (`id` y `name`) |

**Reglas de validacion compatibles:** `required-array`

**Ejemplo:**

```json
{
  "name": "sintomas",
  "label": "Sintomas reportados",
  "type": "simple_multiselect",
  "default": ["Dolor"],
  "props": {
    "required": true,
    "placeholder": "Seleccione los sintomas",
    "options": [
      { "id": "Dolor", "name": "Dolor" },
      { "id": "Fiebre", "name": "Fiebre" },
      { "id": "Tos", "name": "Tos" },
      { "id": "Nauseas", "name": "Nauseas" }
    ]
  },
  "rules": ["required-array"]
}
```

---

### 3.7 `multiselect` - Seleccion multiple (dropdown)

Permite elegir VARIAS opciones desde un menu desplegable.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |
| `options` | Lista de opciones (`id` y `name`) |

**Reglas de validacion compatibles:** `required-array`

**Ejemplo:**

```json
{
  "name": "examenes",
  "label": "Examenes solicitados",
  "type": "multiselect",
  "props": {
    "placeholder": "Seleccione examenes",
    "class": "col-span-2",
    "options": [
      { "id": "1", "name": "Hemograma" },
      { "id": "2", "name": "Glicemia" },
      { "id": "3", "name": "Uroanalisis" }
    ]
  },
  "rules": ["required-array"]
}
```

---

### 3.8 `multiselect_search` - Seleccion multiple con busqueda en servidor

Igual que `multiselect`, pero busca las opciones en el servidor a medida que el usuario escribe. Ideal para listas muy grandes.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |
| `options` | Lista de opciones fijas (opcional si se usa `query`) |

**Reglas de validacion compatibles:** `required-array`

**Ejemplo:**

```json
{
  "name": "diagnosticos",
  "label": "Diagnosticos CIE-10",
  "type": "multiselect_search",
  "props": {
    "placeholder": "Buscar diagnostico...",
    "class": "col-span-2"
  },
  "query": {
    "entity": "cie10",
    "label": "name",
    "value": "code"
  }
}
```

---

### 3.9 `textarea` - Texto largo

Campo de texto con multiples lineas. Util para observaciones, descripciones, etc.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo (se recomienda `col-span-6` para ancho completo) |

**Reglas de validacion compatibles:** `required`, `minlength`, `maxlength`, `pattern`

**Ejemplo:**

```json
{
  "name": "observaciones",
  "label": "Observaciones generales",
  "type": "textarea",
  "props": {
    "placeholder": "Escriba sus observaciones aqui...",
    "class": "col-span-6"
  }
}
```

---

### 3.10 `file` - Carga de archivo

Permite al usuario adjuntar un archivo.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo (se recomienda `col-span-6`) |
| `accept` | Tipo de archivo permitido. Ejemplos: `"application/pdf"`, `"image/*"`, `"image/png,image/jpeg"` |
| `size` | Tamano maximo del archivo en MB |

**Reglas de validacion compatibles:** `required`, `file`

**Ejemplo:**

```json
{
  "name": "resultado_laboratorio",
  "label": "Adjuntar resultado",
  "type": "file",
  "props": {
    "class": "col-span-6",
    "accept": "application/pdf",
    "size": 5
  },
  "rules": ["file:pdf"]
}
```

---

### 3.11 `subtitle` - Subtitulo (solo visual)

Muestra un texto como separador o titulo de seccion dentro de un grupo. **No es un campo de entrada**, no guarda ningun valor.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `text` | **(Obligatorio)** El texto del subtitulo |
| `class` | Ancho (se recomienda `col-span-6` para ancho completo) |

**Reglas de validacion compatibles:** Ninguna (no es un campo de entrada)

**Ejemplo:**

```json
{
  "name": "titulo_antecedentes",
  "type": "subtitle",
  "props": {
    "text": "Antecedentes Personales",
    "class": "col-span-6"
  }
}
```

---

### 3.12 `imc` - Indice de Masa Corporal

Campo especializado que calcula automaticamente el IMC a partir del peso y la talla.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo |

**Reglas de validacion compatibles:** `required`

**Ejemplo:**

```json
{
  "name": "imc_paciente",
  "label": "IMC",
  "type": "imc",
  "props": {
    "placeholder": "",
    "class": "col-span-2"
  }
}
```

---

### 3.13 `audiogram` - Audiometria

Campo especializado para registrar un examen de audiometria con su grafica.

**Configuracion en `props`:**

| Propiedad | Descripcion |
|-----------|-------------|
| `placeholder` | Texto de ayuda |
| `class` | Ancho del campo (se recomienda `col-span-6`) |

**Reglas de validacion compatibles:** `required`

**Ejemplo:**

```json
{
  "name": "audiometria",
  "label": "Examen de Audiometria",
  "type": "audiogram",
  "props": {
    "placeholder": "",
    "class": "col-span-6"
  }
}
```

---

## 4. Reglas de validacion

Las reglas controlan que el usuario ingrese datos correctos antes de poder guardar el formulario. Se colocan en la propiedad `rules` como una lista de textos.

Cuando una regla necesita un parametro adicional, se agrega despues de dos puntos (`:`). Si necesita varios parametros, se separan con comas.

```json
"rules": ["required", "number", "min:0", "max:200"]
```

A continuacion se explica cada regla disponible con detalle.

---

### 4.1 `required` - Campo obligatorio

Hace que el campo no pueda quedar vacio. Si el usuario no llena el campo e intenta guardar, vera el mensaje **"Este campo es requerido!"**.

**Usar en:** `text`, `number`, `date`, `select`, `textarea`, `file`, `imc`, `audiogram`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "nombre",
  "label": "Nombre",
  "type": "text",
  "rules": ["required"]
}
```

---

### 4.2 `required-array` - Seleccion multiple obligatoria

Para campos donde se eligen varias opciones. Obliga a que el usuario seleccione **al menos una** opcion. Mensaje: **"Debe tener al menos un elemento"**.

**Usar en:** `multiselect`, `multiselect_search`, `simple_multiselect`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "examenes",
  "label": "Examenes",
  "type": "multiselect",
  "props": {
    "options": [
      { "id": "1", "name": "Hemograma" },
      { "id": "2", "name": "Glicemia" }
    ]
  },
  "rules": ["required-array"]
}
```

---

### 4.3 `required-check` - Toggle obligatorio

Obliga a que el toggle/checkbox este **activado** (en "Si"). Util para aceptacion de terminos o confirmaciones. Mensaje: **"Este campo es requerido!"**.

**Usar en:** `check`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "acepta_terminos",
  "label": "Acepta los terminos y condiciones",
  "type": "check",
  "rules": ["required-check"]
}
```

---

### 4.4 `email` - Correo electronico valido

Verifica que el texto tenga formato de correo electronico (ejemplo: `usuario@dominio.com`). Mensaje: **"El email no es valido!"**.

**Usar en:** `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "correo",
  "label": "Correo electronico",
  "type": "text",
  "props": { "placeholder": "correo@ejemplo.com" },
  "rules": ["required", "email"]
}
```

---

### 4.5 `url` - Direccion web valida

Verifica que el texto sea una URL valida (ejemplo: `https://www.ejemplo.com`). Mensaje: **"La URL no es valida!"**.

**Usar en:** `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "sitio_web",
  "label": "Sitio web",
  "type": "text",
  "props": { "placeholder": "https://www.ejemplo.com" },
  "rules": ["url"]
}
```

---

### 4.6 `upper` - Solo mayusculas

Solo permite letras mayusculas (A-Z), numeros (0-9), la letra N y espacios. Si el usuario escribe minusculas u otros caracteres, vera el mensaje **"Solo se permiten mayusculas"**.

**Usar en:** `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "codigo",
  "label": "Codigo",
  "type": "text",
  "props": { "placeholder": "ABC123" },
  "rules": ["required", "upper"]
}
```

El usuario podria escribir `ABC123`, `CODIGO XYZ`, pero NO `abc123` ni `Codigo`.

---

### 4.7 `alphanumeric` - Letras y numeros

Permite letras (mayusculas, minusculas, con acentos, n), numeros, espacios y los caracteres especiales `- _ & ( )`. Mensaje: **"Solo se permiten caracteres alfanumericos y ()-_&"**.

**Usar en:** `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "direccion",
  "label": "Direccion",
  "type": "text",
  "props": { "placeholder": "Calle 10 #5-20" },
  "rules": ["required", "alphanumeric"]
}
```

Valores validos: `Calle 10`, `Apt-3B`, `Centro (piso 2)`. Valores invalidos: `Calle 10 @#!`.

---

### 4.8 `onlyletters` - Solo letras

Solo permite letras (mayusculas y minusculas, incluyendo acentos y n) y espacios. NO permite numeros ni caracteres especiales. Mensaje: **"Solo se permiten letras y acentos"**.

**Usar en:** `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "nombre",
  "label": "Nombre completo",
  "type": "text",
  "props": { "placeholder": "Ingrese nombre" },
  "rules": ["required", "onlyletters"]
}
```

Valores validos: `Maria Jose`, `Andres Munoz`. Valores invalidos: `Maria123`, `Juan-Carlos`.

---

### 4.9 `pattern` - Patron personalizado

Valida el texto contra un patron (expresion regular) que tu defines. Esto es util cuando ninguna otra regla cubre tu necesidad. Mensaje: **"El formato no es valido!"**.

**Usar en:** `text`, `textarea`

**Parametros:** El patron a cumplir (expresion regular) despues de `:`

**Ejemplo - Solo 3 letras mayusculas seguidas de 4 numeros:**
```json
{
  "name": "codigo_interno",
  "label": "Codigo interno",
  "type": "text",
  "props": { "placeholder": "ABC1234" },
  "rules": ["required", "pattern:^[A-Z]{3}[0-9]{4}$"]
}
```

Valores validos: `ABC1234`, `XYZ0001`. Valores invalidos: `abc1234`, `AB123`, `ABCD1234`.

**Ejemplo - Numero de telefono colombiano (10 digitos que empieza por 3):**
```json
{
  "name": "telefono",
  "label": "Telefono celular",
  "type": "text",
  "rules": ["required", "pattern:^3[0-9]{9}$"]
}
```

---

### 4.10 `number` - Numero valido

Verifica que el valor ingresado sea un numero. Mensaje: **"Debe ser un numero!"**.

**Usar en:** `number`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "cantidad",
  "label": "Cantidad",
  "type": "number",
  "rules": ["required", "number"]
}
```

---

### 4.11 `positive` - Numero positivo

El numero debe ser mayor que cero. No acepta cero ni numeros negativos. Mensaje: **"Debe ser un numero positivo!"**.

**Usar en:** `number`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "precio",
  "label": "Precio",
  "type": "number",
  "props": { "placeholder": "0" },
  "rules": ["required", "number", "positive"]
}
```

Valores validos: `1`, `50.5`, `1000`. Valores invalidos: `0`, `-5`.

---

### 4.12 `integer` - Numero entero

Solo permite numeros enteros (sin punto decimal ni comas). Mensaje: **"Debe ser un numero entero!"**.

**Usar en:** `number`, `text`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "numero_documento",
  "label": "Numero de documento",
  "type": "text",
  "rules": ["required", "integer"]
}
```

Valores validos: `123`, `456789`. Valores invalidos: `12.5`, `abc`, `12-34`.

---

### 4.13 `decimal` - Formato decimal controlado

Controla cuantos digitos enteros y cuantos decimales puede tener un numero. El separador decimal debe ser punto (`.`). Mensaje: **"Debe ser un decimal valido (con punto), maximo X enteros y maximo Y decimales!"**.

**Usar en:** `number`, `text`

**Parametros:** `enteros,decimales` (ambos opcionales, por defecto 8 y 8)

| Formato | Significado | Valores validos | Valores invalidos |
|---------|-------------|-----------------|-------------------|
| `decimal` | Hasta 8 enteros y 8 decimales | `12345678.12345678` | `123456789.1` (9 enteros) |
| `decimal:3,2` | Hasta 3 enteros y 2 decimales | `123`, `12.50`, `1.5` | `1234`, `12.567` |
| `decimal:5,0` | Hasta 5 enteros, sin decimales | `12345` | `123.45` |

**Ejemplo:**
```json
{
  "name": "peso",
  "label": "Peso (kg)",
  "type": "number",
  "props": { "placeholder": "0.00" },
  "rules": ["required", "decimal:3,2"]
}
```

Valores validos: `75`, `80.5`, `120.75`. Valores invalidos: `1234`, `80.567`.

---

### 4.14 `min` - Valor minimo

El numero ingresado debe ser **mayor o igual** al valor indicado. Mensaje: **"Debe ser mayor o igual a X!"**.

**Usar en:** `number`

**Parametros:** El valor minimo despues de `:`

**Ejemplo:**
```json
{
  "name": "edad",
  "label": "Edad",
  "type": "number",
  "rules": ["required", "number", "min:0"]
}
```

Con `min:0`: valores validos `0`, `5`, `100`. Valor invalido: `-1`.

---

### 4.15 `max` - Valor maximo

El numero ingresado debe ser **menor o igual** al valor indicado. Mensaje: **"Debe ser menor o igual a X!"**.

**Usar en:** `number`

**Parametros:** El valor maximo despues de `:`

**Ejemplo:**
```json
{
  "name": "edad",
  "label": "Edad",
  "type": "number",
  "rules": ["required", "number", "min:0", "max:150"]
}
```

Con `max:150`: valores validos `0`, `75`, `150`. Valor invalido: `151`.

---

### 4.16 `between` - Valor entre dos numeros

El numero debe estar entre un minimo y un maximo. Mensaje: **"Debe ser mayor a X!"** o **"Debe ser menor a Y!"**.

**Usar en:** `number`

**Parametros:** `minimo,maximo` despues de `:`

**Ejemplo:**
```json
{
  "name": "porcentaje",
  "label": "Porcentaje",
  "type": "number",
  "props": { "placeholder": "0-100" },
  "rules": ["required", "between:0,100"]
}
```

Valores validos: `0`, `50`, `100`. Valores invalidos: `-1`, `101`.

---

### 4.17 `minlength` - Longitud minima de texto

El texto debe tener al menos la cantidad de caracteres indicada. Mensaje: **"Debe tener al menos X caracteres!"**.

**Usar en:** `text`, `textarea`

**Parametros:** Cantidad minima de caracteres despues de `:`

**Ejemplo:**
```json
{
  "name": "contrasena",
  "label": "Contrasena",
  "type": "text",
  "rules": ["required", "minlength:8"]
}
```

Con `minlength:8`: valor valido `miClave123` (10 caracteres). Valor invalido: `abc` (3 caracteres).

---

### 4.18 `maxlength` - Longitud maxima de texto

El texto no puede tener mas caracteres de los indicados. Mensaje: **"Debe tener como maximo X caracteres!"**.

**Usar en:** `text`, `textarea`

**Parametros:** Cantidad maxima de caracteres despues de `:`

**Ejemplo:**
```json
{
  "name": "observaciones",
  "label": "Observaciones",
  "type": "textarea",
  "props": { "class": "col-span-6" },
  "rules": ["maxlength:500"]
}
```

---

### 4.19 `date` - Fecha valida

Verifica que el valor ingresado sea una fecha valida. Mensaje: **"Debe ser una fecha valida!"**.

**Usar en:** `date`

**Parametros:** Ninguno

**Ejemplo:**
```json
{
  "name": "fecha_ingreso",
  "label": "Fecha de ingreso",
  "type": "date",
  "rules": ["required", "date"]
}
```

---

### 4.20 `before` - Fecha posterior a otra

Obliga a que la fecha sea **posterior** a otra fecha. Esa otra fecha puede ser:
- Una fecha fija (ejemplo: `"before:2024-01-01"`)
- Otro campo del formulario usando `$` (ejemplo: `"before:$fecha_inicio"`)

Mensaje: **"Debe ser mayor a DD/MM/YYYY!"**.

**Usar en:** `date`

**Parametros:** La fecha de referencia despues de `:`

**Ejemplo con fecha fija:**
```json
{
  "name": "fecha_contrato",
  "label": "Fecha del contrato",
  "type": "date",
  "rules": ["required", "date", "before:2020-01-01"]
}
```

La fecha debe ser posterior al 01/01/2020.

**Ejemplo referenciando otro campo del formulario:**
```json
[
  {
    "name": "fecha_inicio",
    "label": "Fecha de inicio",
    "type": "date",
    "rules": ["required", "date"]
  },
  {
    "name": "fecha_fin",
    "label": "Fecha de fin",
    "type": "date",
    "rules": ["required", "date", "before:$fecha_inicio"]
  }
]
```

Aqui `$fecha_inicio` toma automaticamente el valor que el usuario selecciono en el campo "Fecha de inicio", y obliga a que "Fecha de fin" sea posterior.

---

### 4.21 `file` - Extensiones de archivo permitidas

Restringe que tipo de archivo se puede subir, segun su extension. Si el usuario sube un archivo con otra extension, vera el mensaje **"Formato no soportado, solo se permiten (pdf,jpg,...)"**.

**Usar en:** `file`

**Parametros:** Las extensiones permitidas separadas por comas (sin punto)

**Ejemplo - Solo PDF:**
```json
{
  "name": "documento",
  "label": "Documento adjunto",
  "type": "file",
  "props": { "class": "col-span-6", "accept": "application/pdf", "size": 5 },
  "rules": ["file:pdf"]
}
```

**Ejemplo - PDF, JPG y PNG:**
```json
{
  "name": "soporte",
  "label": "Archivo de soporte",
  "type": "file",
  "props": { "class": "col-span-6", "accept": "application/pdf,image/jpeg,image/png", "size": 10 },
  "rules": ["file:pdf,jpg,png"]
}
```

> **Nota:** La propiedad `accept` en `props` controla que archivos se pueden seleccionar en el explorador de archivos. La regla `file` valida la extension al guardar. Se recomienda usar ambos para mayor seguridad.

---

### 4.22 Resumen rapido de todas las reglas

| Regla | Parametros | Mensaje de error | Campos compatibles |
|-------|------------|------------------|--------------------|
| `required` | - | Este campo es requerido! | `text`, `number`, `date`, `select`, `textarea`, `file`, `imc`, `audiogram` |
| `required-array` | - | Debe tener al menos un elemento | `multiselect`, `multiselect_search`, `simple_multiselect` |
| `required-check` | - | Este campo es requerido! | `check` |
| `email` | - | El email no es valido! | `text` |
| `url` | - | La URL no es valida! | `text` |
| `upper` | - | Solo se permiten mayusculas | `text` |
| `alphanumeric` | - | Solo se permiten caracteres alfanumericos y ()-_& | `text` |
| `onlyletters` | - | Solo se permiten letras y acentos | `text` |
| `pattern` | expresion regular | El formato no es valido! | `text`, `textarea` |
| `number` | - | Debe ser un numero! | `number` |
| `positive` | - | Debe ser un numero positivo! | `number` |
| `integer` | - | Debe ser un numero entero! | `number`, `text` |
| `decimal` | `enteros,decimales` | Debe ser un decimal valido... | `number`, `text` |
| `min` | `valor` | Debe ser mayor o igual a X! | `number` |
| `max` | `valor` | Debe ser menor o igual a X! | `number` |
| `between` | `min,max` | Debe ser mayor/menor a X! | `number` |
| `minlength` | `cantidad` | Debe tener al menos X caracteres! | `text`, `textarea` |
| `maxlength` | `cantidad` | Debe tener como maximo X caracteres! | `text`, `textarea` |
| `date` | - | Debe ser una fecha valida! | `date` |
| `before` | `fecha` o `$campo` | Debe ser mayor a DD/MM/YYYY! | `date` |
| `file` | `extensiones` | Formato no soportado... | `file` |

---

### 4.23 Ejemplos de combinaciones comunes

**Nombre obligatorio, solo letras, entre 3 y 100 caracteres:**
```json
"rules": ["required", "onlyletters", "minlength:3", "maxlength:100"]
```

**Edad obligatoria, numero entero entre 0 y 150:**
```json
"rules": ["required", "number", "integer", "min:0", "max:150"]
```

**Peso con decimales (hasta 3 enteros y 2 decimales):**
```json
"rules": ["required", "decimal:3,2"]
```

**Correo electronico obligatorio:**
```json
"rules": ["required", "email"]
```

**Fecha posterior a otra fecha del formulario:**
```json
"rules": ["required", "date", "before:$fecha_inicio"]
```

**Codigo alfanumerico en mayusculas de exactamente 6 caracteres:**
```json
"rules": ["required", "upper", "minlength:6", "maxlength:6"]
```

**Porcentaje obligatorio entre 0 y 100:**
```json
"rules": ["required", "number", "between:0,100"]
```

**Archivo PDF obligatorio:**
```json
"rules": ["required", "file:pdf"]
```

**Direccion web opcional (si la llena, debe ser valida):**
```json
"rules": ["url"]
```

**Numero de documento: solo digitos, entre 6 y 15 caracteres:**
```json
"rules": ["required", "integer", "minlength:6", "maxlength:15"]
```

---

## 5. Mostrar u ocultar campos condicionalmente

La propiedad `if` permite que un campo solo aparezca cuando se cumple cierta condicion.

### Mostrar si otro campo esta lleno o activado

Se escribe el `name` del campo que controla la visibilidad:

```json
{
  "name": "tiene_alergia",
  "label": "Tiene alguna alergia?",
  "type": "check"
},
{
  "name": "detalle_alergia",
  "label": "Describa la alergia",
  "type": "textarea",
  "if": "tiene_alergia",
  "props": { "class": "col-span-6" }
}
```

En este ejemplo, "Describa la alergia" solo se muestra si el toggle "Tiene alguna alergia?" esta activado.

### Mostrar con una condicion especifica

Se usa un objeto con `field` (el campo a evaluar) y `condition` (operador y valor):

```json
{
  "name": "tipo_tratamiento",
  "label": "Tipo de tratamiento",
  "type": "select",
  "props": {
    "options": [
      { "id": "farmacologico", "name": "Farmacologico" },
      { "id": "terapia", "name": "Terapia" },
      { "id": "ninguno", "name": "Ninguno" }
    ]
  }
},
{
  "name": "nombre_medicamento",
  "label": "Nombre del medicamento",
  "type": "text",
  "if": {
    "field": "tipo_tratamiento",
    "condition": "== farmacologico"
  }
}
```

"Nombre del medicamento" solo aparece si el tipo de tratamiento es "farmacologico".

### Operadores disponibles para condiciones

| Operador | Significado | Ejemplo de `condition` |
|----------|-------------|----------------------|
| `==` | Es igual a | `"== activo"` |
| `!=` | Es diferente de | `"!= inactivo"` |
| `>` | Mayor que | `"> 18"` |
| `>=` | Mayor o igual que | `">= 18"` |
| `<` | Menor que | `"< 65"` |
| `<=` | Menor o igual que | `"<= 100"` |
| `contains` | Contiene el texto | `"contains diabetes"` |
| `not-contains` | No contiene el texto | `"not-contains normal"` |
| `starts-with` | Empieza con | `"starts-with A"` |
| `ends-with` | Termina con | `"ends-with pdf"` |
| `is-empty` | Esta vacio | `"is-empty"` |
| `is-not-empty` | No esta vacio | `"is-not-empty"` |

### Ocultar o mostrar un grupo completo

Los grupos tambien aceptan `if` para mostrar/ocultar toda la seccion:

```json
{
  "name": "Datos de embarazo",
  "if": "esta_embarazada",
  "fields": [ ... ]
}
```

---

## 6. Campos dependientes (dependsOn)

Cuando las opciones de un campo dependen de lo que se selecciono en otro, se usa `dependsOn`. Esto es comun en cascadas como Departamento > Ciudad.

```json
[
  {
    "name": "departamento",
    "label": "Departamento",
    "type": "select",
    "props": { "placeholder": "Seleccione departamento", "class": "col-span-2" },
    "query": { "entity": "departments", "label": "name", "value": "id" },
    "rules": ["required"]
  },
  {
    "name": "ciudad",
    "label": "Ciudad",
    "type": "select",
    "props": { "placeholder": "Seleccione ciudad", "class": "col-span-2" },
    "query": { "entity": "cities", "label": "name", "value": "id" },
    "dependsOn": {
      "field": "departamento",
      "filterTag": "department_id"
    },
    "rules": ["required"]
  }
]
```

- `field`: el `name` del campo del que depende.
- `filterTag`: el nombre del parametro que se envia al servidor para filtrar. Si no se pone, se usa el mismo valor de `field`.

Cuando el usuario selecciona un departamento, las ciudades se recargan automaticamente mostrando solo las de ese departamento.

---

## 7. Ancho de los campos

El formulario usa un sistema de 6 columnas. El ancho se controla con la propiedad `class` dentro de `props`:

| Clase | Que ocupa | Cuando usarla |
|-------|-----------|---------------|
| `col-span-1` | 1/6 del ancho | Campos muy pequenos |
| `col-span-2` | 1/3 del ancho | Campos comunes: texto, numero, fecha, select |
| `col-span-3` | 1/2 del ancho | Campos medianos |
| `col-span-4` | 2/3 del ancho | Campos amplios |
| `col-span-6` | Ancho completo | Textarea, archivo, audiograma, subtitulo |

Si no se especifica `class`, el campo toma un ancho por defecto responsivo.

---

## 8. Valores por defecto

La propiedad `default` define el valor inicial del campo al cargar el formulario.

```json
{ "name": "pais", "type": "text", "default": "Colombia" }
{ "name": "cantidad", "type": "number", "default": 1 }
{ "name": "activo", "type": "check", "default": true }
{ "name": "opciones", "type": "multiselect", "default": ["opcion1", "opcion2"] }
```

Si no se especifica `default`, cada tipo tiene su valor inicial automatico:

| Tipo de campo | Valor inicial |
|---------------|---------------|
| `text`, `date`, `textarea`, `select`, `file` | Vacio (`""`) |
| `number` | Sin valor |
| `check` | Desactivado (`false`) |
| `multiselect`, `multiselect_search` | Lista vacia (`[]`) |

---

## 9. Propiedades de edicion (editingProps)

Cuando se edita un registro existente (no uno nuevo), puedes cambiar el comportamiento de un campo. Por ejemplo, deshabilitar el campo de documento para que no se pueda modificar:

```json
{
  "name": "documento",
  "label": "Numero de documento",
  "type": "text",
  "props": {
    "placeholder": "Ingrese documento",
    "class": "col-span-2"
  },
  "editingProps": {
    "disabled": true
  },
  "rules": ["required"]
}
```

Al crear un registro nuevo, el campo funciona normal. Al editar uno existente, queda deshabilitado.

---

## 10. Opciones desde el servidor (query)

Para campos de seleccion (`select`, `multiselect`, `multiselect_search`) puedes cargar las opciones desde el servidor en vez de escribirlas a mano:

```json
{
  "name": "eps",
  "label": "EPS",
  "type": "select",
  "props": {
    "placeholder": "Seleccione EPS",
    "class": "col-span-2"
  },
  "query": {
    "entity": "eps",
    "label": "name",
    "value": "id"
  }
}
```

- `entity`: nombre de la tabla o recurso en el servidor.
- `label`: campo que se usa como texto visible de la opcion.
- `value`: campo que se usa como valor guardado.

---

## 11. Ejemplo completo de un formulario

```json
{
  "groups": [
    {
      "name": "Datos del Paciente",
      "description": "Informacion personal basica",
      "fields": [
        {
          "name": "nombres",
          "label": "Nombres",
          "type": "text",
          "props": { "placeholder": "Ingrese nombres", "class": "col-span-2" },
          "rules": ["required", "onlyletters", "maxlength:100"]
        },
        {
          "name": "apellidos",
          "label": "Apellidos",
          "type": "text",
          "props": { "placeholder": "Ingrese apellidos", "class": "col-span-2" },
          "rules": ["required", "onlyletters", "maxlength:100"]
        },
        {
          "name": "documento",
          "label": "Numero de documento",
          "type": "text",
          "props": { "placeholder": "Ingrese documento", "class": "col-span-2" },
          "editingProps": { "disabled": true },
          "rules": ["required", "integer", "minlength:6", "maxlength:15"]
        },
        {
          "name": "fecha_nacimiento",
          "label": "Fecha de nacimiento",
          "type": "date",
          "props": { "class": "col-span-2" },
          "rules": ["required", "date"]
        },
        {
          "name": "genero",
          "label": "Genero",
          "type": "select",
          "props": {
            "placeholder": "Seleccione",
            "class": "col-span-2",
            "options": [
              { "id": "M", "name": "Masculino" },
              { "id": "F", "name": "Femenino" }
            ]
          },
          "rules": ["required"]
        },
        {
          "name": "email",
          "label": "Correo electronico",
          "type": "text",
          "props": { "placeholder": "correo@ejemplo.com", "class": "col-span-2" },
          "rules": ["email"]
        }
      ]
    },
    {
      "name": "Ubicacion",
      "fields": [
        {
          "name": "departamento",
          "label": "Departamento",
          "type": "select",
          "props": { "placeholder": "Seleccione", "class": "col-span-2" },
          "query": { "entity": "departments", "label": "name", "value": "id" },
          "rules": ["required"]
        },
        {
          "name": "ciudad",
          "label": "Ciudad",
          "type": "select",
          "props": { "placeholder": "Seleccione", "class": "col-span-2" },
          "query": { "entity": "cities", "label": "name", "value": "id" },
          "dependsOn": { "field": "departamento", "filterTag": "department_id" },
          "rules": ["required"]
        }
      ]
    },
    {
      "name": "Informacion Medica",
      "fields": [
        {
          "name": "titulo_signos",
          "type": "subtitle",
          "props": { "text": "Signos Vitales", "class": "col-span-6" }
        },
        {
          "name": "peso",
          "label": "Peso (kg)",
          "type": "number",
          "props": { "placeholder": "0.00", "class": "col-span-2" },
          "rules": ["required", "decimal:3,2", "min:0"]
        },
        {
          "name": "talla",
          "label": "Talla (cm)",
          "type": "number",
          "props": { "placeholder": "0", "class": "col-span-2" },
          "rules": ["required", "number", "min:0", "max:300"]
        },
        {
          "name": "imc",
          "label": "IMC",
          "type": "imc",
          "props": { "class": "col-span-2" }
        },
        {
          "name": "tiene_alergia",
          "label": "Tiene alguna alergia?",
          "type": "check",
          "props": { "class": "col-span-2" }
        },
        {
          "name": "detalle_alergia",
          "label": "Describa las alergias",
          "type": "textarea",
          "if": "tiene_alergia",
          "props": {
            "placeholder": "Detalle las alergias del paciente...",
            "class": "col-span-6"
          },
          "rules": ["required", "maxlength:500"]
        },
        {
          "name": "diagnosticos",
          "label": "Diagnosticos",
          "type": "multiselect_search",
          "props": { "placeholder": "Buscar diagnostico...", "class": "col-span-4" },
          "query": { "entity": "cie10", "label": "name", "value": "code" }
        },
        {
          "name": "resultado_examen",
          "label": "Adjuntar resultado de examen",
          "type": "file",
          "props": {
            "class": "col-span-6",
            "accept": "application/pdf",
            "size": 10
          },
          "rules": ["file:pdf"]
        },
        {
          "name": "observaciones",
          "label": "Observaciones",
          "type": "textarea",
          "props": {
            "placeholder": "Observaciones generales...",
            "class": "col-span-6"
          }
        }
      ]
    }
  ]
}
```

---

## 12. Resumen rapido de tipos y sus reglas

| Tipo | Que es | Reglas recomendadas |
|------|--------|---------------------|
| `text` | Texto en una linea | `required`, `email`, `url`, `upper`, `alphanumeric`, `onlyletters`, `minlength`, `maxlength`, `pattern` |
| `number` | Numero | `required`, `number`, `positive`, `integer`, `decimal`, `min`, `max`, `between` |
| `check` | Toggle Si/No | `required-check` |
| `date` | Fecha | `required`, `date`, `before` |
| `select` | Lista desplegable (una opcion) | `required` |
| `simple_multiselect` | Seleccion multiple (chips) | `required-array` |
| `multiselect` | Seleccion multiple (dropdown) | `required-array` |
| `multiselect_search` | Seleccion multiple con busqueda | `required-array` |
| `textarea` | Texto largo | `required`, `minlength`, `maxlength`, `pattern` |
| `file` | Carga de archivo | `required`, `file` |
| `subtitle` | Titulo visual (no es campo) | *(ninguna)* |
| `imc` | Calculadora de IMC | `required` |
| `audiogram` | Examen de audiometria | `required` |
