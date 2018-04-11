import { combineReducers, ReducersMapObject } from 'redux';
import profilePageIm, { State as ProfileState } from './profile';

const reducersMap: ReducersMapObject = { profilePageIm };

const pagesReducers = combineReducers<ProfileState>(reducersMap);

export default pagesReducers;
