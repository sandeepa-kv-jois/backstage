import { createComponentExtension, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { myPluginRouteRef } from './route-refs';
import { rootRouteRef } from './routes';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
  routes: {
    root: rootRouteRef,
  },
});



export const MyPluginPage = myPluginPlugin.provide(
  createRoutableExtension({
    name: 'MyPluginPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityMyPluginCard = myPluginPlugin.provide(
  createComponentExtension({
    name: 'EntitiyPluginCard',
    component: {
      lazy: () =>
      import('./components/EntityOverviewCard').then(m => m.EntityOverviewCard)
    },
  }),
);

export const EntityMyPluginContent = myPluginPlugin.provide(
  createRoutableExtension({
    name: 'EntitiyPluginCard',
    component: () => 
      import('./components/Router').then(m => m.Router),
    mountPoint: myPluginRouteRef,
    
  }),
);

