export function successResponse(data: any = null, message = 'Success', status = 200) {
  return {
    status: 'success',
    message,
    data,
    code: status,
  }
}

export function errorResponse(message = 'Something went wrong', status = 500, errors: any = null) {
  return {
    status: 'error',
    message,
    errors,
    code: status,
  }
}

export function validationErrorResponse(errors: any, message = 'Validation failed', status = 422) {
  return {
    status: 'fail',
    message,
    errors,
    code: status,
  }
}

export function messageResponse(message: string, status = 200) {
  return {
    status: 'success',
    message,
    code: status,
  }
}
