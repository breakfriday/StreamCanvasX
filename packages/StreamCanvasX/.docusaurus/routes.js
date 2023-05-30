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
    path: '/demos/IcePkgDemo_0a1f41',
    component: ComponentCreator('/demos/IcePkgDemo_0a1f41', 'ea4'),
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
    path: '/demos/IcePkgDemo_971139',
    component: ComponentCreator('/demos/IcePkgDemo_971139', '6a0'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_af484d',
    component: ComponentCreator('/demos/IcePkgDemo_af484d', '2cc'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_c236dd',
    component: ComponentCreator('/demos/IcePkgDemo_c236dd', 'a14'),
    exact: true
  },
  {
    path: '/demos/IcePkgDemo_cf168f',
    component: ComponentCreator('/demos/IcePkgDemo_cf168f', 'b7b'),
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
