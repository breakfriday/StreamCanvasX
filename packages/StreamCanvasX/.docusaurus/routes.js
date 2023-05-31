import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'c0e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'ae9'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '91f'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '82e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '349'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '7c4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '6d0'),
    exact: true
  },
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
