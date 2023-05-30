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
    path: '/demos/IcePkgDemo_1f7bb5',
    component: ComponentCreator('/demos/IcePkgDemo_1f7bb5', '346'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_40326d',
    component: ComponentCreator('/demos/IcePkgDemo_40326d', '41a'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_4e04fd',
    component: ComponentCreator('/demos/IcePkgDemo_4e04fd', 'fc9'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_597d96',
    component: ComponentCreator('/demos/IcePkgDemo_597d96', 'a8e'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_5ac829',
    component: ComponentCreator('/demos/IcePkgDemo_5ac829', '035'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_5ec5be',
    component: ComponentCreator('/demos/IcePkgDemo_5ec5be', 'a15'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_710bb9',
    component: ComponentCreator('/demos/IcePkgDemo_710bb9', '7a5'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_7ad6c9',
    component: ComponentCreator('/demos/IcePkgDemo_7ad6c9', '938'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_803fd3',
    component: ComponentCreator('/demos/IcePkgDemo_803fd3', 'ae4'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_8c0065',
    component: ComponentCreator('/demos/IcePkgDemo_8c0065', '0e7'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_9dcffd',
    component: ComponentCreator('/demos/IcePkgDemo_9dcffd', '9de'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_ca2e51',
    component: ComponentCreator('/demos/IcePkgDemo_ca2e51', '3b8'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_ee6363',
    component: ComponentCreator('/demos/IcePkgDemo_ee6363', '64b'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'c38'),
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
