import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/StreamCanvasX/__docusaurus/debug',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug', '67a'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/config',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/config', '589'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/content',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/content', '2eb'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/globalData',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/globalData', '852'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/metadata',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/metadata', '0f7'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/registry',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/registry', '2d7'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/routes',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/routes', '089'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_2ac6eb',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_2ac6eb', '6c5'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_3d1c42',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_3d1c42', 'b14'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_75e193',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_75e193', '492'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_8bcb51',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_8bcb51', 'd28'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_bb32fb',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_bb32fb', '944'),
    exact: true
  },
  {
    path: '/StreamCanvasX/',
    component: ComponentCreator('/StreamCanvasX/', '937'),
    routes: [
      {
        path: '/StreamCanvasX/',
        component: ComponentCreator('/StreamCanvasX/', '242'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/StreamCanvasX/advanced',
        component: ComponentCreator('/StreamCanvasX/advanced', '021'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/StreamCanvasX/API',
        component: ComponentCreator('/StreamCanvasX/API', 'a19'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/StreamCanvasX/guild',
        component: ComponentCreator('/StreamCanvasX/guild', '094'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/StreamCanvasX/inxtro',
        component: ComponentCreator('/StreamCanvasX/inxtro', '97a'),
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
