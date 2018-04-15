import { combineReducers, ReducersMapObject } from 'redux';
import profilePageIm, { TState as TProfileState } from './profile';

const reducersMap: ReducersMapObject = { profilePageIm };

const pagesReducers = combineReducers<TProfileState>(reducersMap);

export default pagesReducers;
