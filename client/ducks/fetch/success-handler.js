/* eslint-disable require-yield */
function* successHandler(dispatch, { status, data }) {
  return {
    status,
    data,
    originalData: data,
    isSuccess: true,
  };
}

export default successHandler;
