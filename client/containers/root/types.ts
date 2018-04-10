import { Store } from 'redux';
import { StatelessComponent } from 'react';

export interface IRootProps {
  store: Store<any>
}

export type IRootComponent = StatelessComponent<IRootProps>;
