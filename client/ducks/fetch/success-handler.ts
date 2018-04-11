import { Dispatch } from 'redux';

export type TSuccessResult =
  { status: number, data?: object, originalData?: object, isSuccess: boolean };

interface ISuccessHandler {
  (dispatch: Dispatch<any>, options: { status: number, data?: object }): TSuccessResult;
}

const successHandler: ISuccessHandler = (dispatch, { status, data }) => ({
  status,
  data,
  originalData: data,
  isSuccess: true,
});

export default successHandler;
