import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'b1e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '8bc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '1d5'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '2a3'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '764'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '32c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '019'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '9ea'),
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
