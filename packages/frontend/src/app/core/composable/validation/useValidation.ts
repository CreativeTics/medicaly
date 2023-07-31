import { reactive, ref } from 'vue'
import { globalRules } from './rules'

export default function useValidation() {
  const model = reactive<any>({})
  const dependsOn = reactive<any>({})
  const validationSchema = reactive<any>({})
  let globalErrors = reactive<any>([])
  const isValid = ref<boolean>(true)

  const validateSchema = (): boolean => {
    globalErrors = []
    Object.keys(validationSchema).forEach(key => {
      const rules = validationSchema[key].rules
      let errors = []
      const passDependsOn = !dependsOn[key] || !!model[dependsOn[key]]
      if (passDependsOn) {
        errors = rules?.map((rule: any) => {
          try {
            const params = []
            if (typeof rule === 'string') {
              const [ruleName, ruleParamsString = ''] = rule.split(':')
              if (ruleParamsString) {
                const ruleParams = ruleParamsString.split(',')
                params.push(...ruleParams)
              }
              rule = globalRules.get(ruleName)
            }

            rule(...replaceModelParams(params)).validateSync(model[key])
            return null
          } catch (error: any) {
            return error.message
          }
        })
      }
      validationSchema[key].isValid = errors?.every(
        (error: any) => error === null
      )
      validationSchema[key].errors = errors.filter(
        (error: any) => error !== null
      )
      globalErrors.push(...validationSchema[key].errors)

      isValid.value = globalErrors.length === 0
    })
    return isValid.value
  }

  const replaceModelParams = (params: any[]) => {
    return params.map(param => {
      if (param.startsWith('$')) {
        const key = param.replace('$', '')
        return model[key]
      }
      return param
    })
  }

  const handleValidation = (): boolean => {
    return validateSchema()
  }

  const addValidation = (key: string, rules: any) => {
    validationSchema[key] = {
      rules,
      isValid: false,
      errors: []
    }
  }

  const setInitialModel = (initialModel: any) => {
    Object.keys(initialModel).forEach(key => {
      model[key] = initialModel[key]
    })
  }
  const addDependencyValidation = (opts: {
    key: string
    dependKey: string
  }) => {
    dependsOn[opts.key] = opts.dependKey
  }

  return {
    isValid,
    model,
    addDependencyValidation,
    validationSchema,
    globalErrors,
    handleValidation,
    addValidation,
    setInitialModel
  }
}

export interface ValidationSchemaField {
  rules: string | string[]
  isValid: boolean
  errorMessages: string[]
}
