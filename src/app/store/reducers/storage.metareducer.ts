import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';

export function localStorageSyncReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    const newState = reducer(state, action);
    localStorage.setItem('appState', JSON.stringify(newState));
    return newState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
