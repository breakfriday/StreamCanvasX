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
    path: '/demos/IcePkgDemo_004f02',
    component: ComponentCreator('/demos/IcePkgDemo_004f02', 'f08'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_02d384',
    component: ComponentCreator('/demos/IcePkgDemo_02d384', '043'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_240080',
    component: ComponentCreator('/demos/IcePkgDemo_240080', 'b22'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_2df806',
    component: ComponentCreator('/demos/IcePkgDemo_2df806', '3c1'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_40326d',
    component: ComponentCreator('/demos/IcePkgDemo_40326d', '41a'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_4e20a3',
    component: ComponentCreator('/demos/IcePkgDemo_4e20a3', '0f8'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_667699',
    component: ComponentCreator('/demos/IcePkgDemo_667699', 'b5d'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_6702b4',
    component: ComponentCreator('/demos/IcePkgDemo_6702b4', 'b31'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_7504b3',
    component: ComponentCreator('/demos/IcePkgDemo_7504b3', 'd77'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_ca97ee',
    component: ComponentCreator('/demos/IcePkgDemo_ca97ee', '554'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_e837e3',
    component: ComponentCreator('/demos/IcePkgDemo_e837e3', '95e'),
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
