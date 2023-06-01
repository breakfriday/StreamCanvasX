import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/demos/IcePkgDemo_40326d',
    component: ComponentCreator('/demos/IcePkgDemo_40326d', '41a'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_597d96',
    component: ComponentCreator('/demos/IcePkgDemo_597d96', 'a8e'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_7ad6c9',
    component: ComponentCreator('/demos/IcePkgDemo_7ad6c9', '938'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_aff3dc',
    component: ComponentCreator('/demos/IcePkgDemo_aff3dc', 'ac1'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'a72'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'd65'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/advanced',
        component: ComponentCreator('/advanced', 'bef'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/API',
        component: ComponentCreator('/API', 'faf'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/guild',
        component: ComponentCreator('/guild', '000'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/inxtro',
        component: ComponentCreator('/inxtro', '44f'),
        exact: true,
        sidebar: "defaultSidebar"
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
