function formData(values: object, except?: string) {
  const formValues = new FormData()

  const convertObjectToArray = Object.entries(values)

  convertObjectToArray.forEach((value) => {
    value[0] !== except && formValues.append(value[0], value[1])
  })

  return formValues
}

export default formData
