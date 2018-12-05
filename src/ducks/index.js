import { combineReducers } from 'redux';
import ui from './ui';

export default combineReducers({
  ui,
});

export const getCurrentScreen = state => {
  return state.ui.currentScreen;
};
