import {createStore, combineReducers, applyMiddleware} from 'redux'

import thunk from 'redux-thunk';

import {componentWithDevTools} from 'redux-devtools-extension';

const reducer = combineReducers({


});

let initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    componentWithDevTools(applyMiddleware(...middleware))
    );
export default store;