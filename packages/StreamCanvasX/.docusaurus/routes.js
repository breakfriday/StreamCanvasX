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
    path: '/demos/IcePkgDemo_10b2c8',
    component: ComponentCreator('/demos/IcePkgDemo_10b2c8', '5ce'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_1472c8',
    component: ComponentCreator('/demos/IcePkgDemo_1472c8', '8c0'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_14b5b3',
    component: ComponentCreator('/demos/IcePkgDemo_14b5b3', '4a4'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_192418',
    component: ComponentCreator('/demos/IcePkgDemo_192418', 'c0c'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_242d1b',
    component: ComponentCreator('/demos/IcePkgDemo_242d1b', '847'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_4a1e9b',
    component: ComponentCreator('/demos/IcePkgDemo_4a1e9b', '8be'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_4b9fd9',
    component: ComponentCreator('/demos/IcePkgDemo_4b9fd9', '320'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_68ceb5',
    component: ComponentCreator('/demos/IcePkgDemo_68ceb5', '6e4'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_7504b3',
    component: ComponentCreator('/demos/IcePkgDemo_7504b3', 'd77'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_aa008c',
    component: ComponentCreator('/demos/IcePkgDemo_aa008c', '75e'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_bc79fa',
    component: ComponentCreator('/demos/IcePkgDemo_bc79fa', 'afb'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_d571d4',
    component: ComponentCreator('/demos/IcePkgDemo_d571d4', 'bf3'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_f9757b',
    component: ComponentCreator('/demos/IcePkgDemo_f9757b', '657'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e89'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'd65'),
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
