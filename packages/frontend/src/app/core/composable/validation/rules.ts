import { string, number, date, array } from "yup";
// @ts-ignore
import dayjs from "dayjs";

export const globalRules = new Map<string, any>([
  [
    "required-array",
    () =>
      array()
        .min(1, "Debe tener al menos un elemento")
        .required("Este campo es requerido!"),
  ],
  ["required", () => string().required("Este campo es requerido!")],
  [
    "upper",
    () =>
      string().matches(/^[A-Z0-9\s]+$/, {
        excludeEmptyString: true,
        message: "Solo se permiten mayúsculas",
      }),
  ],
  [
    "regex",
    (regex: RegExp) =>
      string().matches(regex, {
        excludeEmptyString: true,
        message: "El formato no es válido!",
      }),
  ],
  ["email", () => string().email("El email no es válido!")],
  ["url", () => string().url("La URL no es válida!")],
  [
    "date",
    () =>
      date()
        .transform((_) => (isNaN(new Date(_).getTime()) ? undefined : _))
        .typeError("Debe ser una fecha valida!"),
  ],
  [
    "number",
    () =>
      number()
        .transform((_) => (isNaN(_) ? undefined : _))
        .typeError("Debe ser un número!"),
  ],
  [
    "decimal",
    (maxWhole: string = "8", maxDecimal: string = "8") =>
      string().matches(
        new RegExp(
          `(^\\-?[0-9]{1,${maxWhole}}$|^\\-?[0-9]{1,${maxWhole}}\\.[0-9]{1,${maxDecimal}}$)`
        ),
        {
          excludeEmptyString: true,
          message: `Debe ser un decimal valido (con punto), maximo ${maxWhole} enteros y maximo ${maxDecimal} decimales!`,
        }
      ),
  ],
  ["positive", () => number().positive("Debe ser un número positivo!")],
  [
    "integer",
    () =>
      string().matches(/^\d+$/, {
        excludeEmptyString: true,
        message: "Debe ser un número entero!",
      }),
  ],
  [
    "alphanumeric",
    () =>
      string().matches(/^[A-Za-z0-9À-ÿ\u00f1\u00d1\s-_&()]+$/, {
        excludeEmptyString: true,
        message: "Solo se permiten caracteres alfanuméricos y ()-_&",
      }),
  ],
  [
    "onlyletters",
    () =>
      string().matches(/^[A-Za-zÀ-ÿ\s]+$/, {
        excludeEmptyString: true,
        message: "Solo se permiten letras y acentos",
      }),
  ],
  [
    "min",
    (min: number) =>
      number()
        .transform((_) => (isNaN(_) ? undefined : _))
        .min(min, `Debe ser mayor o igual a ${min}!`),
  ],
  [
    "max",
    (max: number) =>
      number()
        .transform((_) => (isNaN(_) ? undefined : _))
        .max(max, `Debe ser menor o igual a ${max}!`),
  ],
  [
    "between",
    (min: number, max: number) =>
      number()
        .min(min, `Debe ser mayor a ${min}!`)
        .max(max, `Debe ser menor a ${max}!`),
  ],
  [
    "before",
    (dateStart: string) => {
      if (dateStart === "") {
        return date().transform((_) =>
          isNaN(new Date(_).getTime()) ? undefined : _
        );
      } else {
        return date()
          .transform((_) => (isNaN(new Date(_).getTime()) ? undefined : _))
          .min(
            dateStart,
            `Debe ser mayor a ${dayjs(dateStart).format("DD/MM/YYYY")}!`
          );
      }
    },
  ],
  [
    "minlength",
    (min: number) =>
      string().min(
        min,
        `Debe tener al menos ${min} ${min === 1 ? "caracter" : "caracteres"}!`
      ),
  ],
  [
    "maxlength",
    (max: number) =>
      string().max(max, `Debe tener como máximo ${max} caracteres!`),
  ],
  [
    "file",
    (...extensions: string[]) =>
      string().test(
        "fileFormat",
        `Formato no soportado, solo se permiten (${extensions.join()})`,
        (value) => {
          const allowedExtensions = extensions;
          let extensionFile: any;
          if (value !== undefined && value !== "") {
            extensionFile = value.split(".").pop();
            return allowedExtensions.includes(extensionFile);
          } else {
            return true;
          }
        }
      ),
  ],
]);
