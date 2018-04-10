import { IRootComponent } from './types';

// eslint-disable-next-line import/no-mutable-exports
let Root: IRootComponent;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  Root = require('./root.prod').default;
} else {
  // eslint-disable-next-line global-require
  Root = require('./root.dev').default;
}

export default Root;
