function setFieldsError(error: any, helpers: any) {
  Object.entries(error.response.data.errors).map((val: any) =>
    helpers.setFieldError(val[0], val[1][0])
  )
}

export default setFieldsError
