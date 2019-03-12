const tryCatchHelper = promise => {
  return promise
    .then(data => [null, data])
    .catch(err => [err]);
};

const errorsHelper = {
  wrongEmail: () => 'user with this email does not exist',
  wrongPass: () => 'wrong credentials',
  unauthenticated: () => 'not authenticated',
  invalidModel: errObj => {
    if (errObj.name && errObj.name === 'SequelizeUniqueConstraintError'
      && errObj.errors && errObj.errors[0].path)
          return `${errObj.errors[0].path} is already taken`;

    if (typeof errObj.errors === 'undefined')
      return 'invalid data';
      
    let msg ='';
    Object.values(errObj.errors).forEach(err => msg = `${msg}\n${err.message}`);
    return msg;
  }
};

module.exports = {
  tryCatchHelper,
  errorsHelper
}