import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_2ac6eb',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_2ac6eb', '953'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_75e193',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_75e193', '545'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_8bcb51',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_8bcb51', 'a00'),
    exact: true
  },
  {
    path: '/StreamCanvasX/demos/IcePkgDemo_bb32fb',
    component: ComponentCreator('/StreamCanvasX/demos/IcePkgDemo_bb32fb', 'd19'),
    exact: true
  },
  {
    path: '/StreamCanvasX/',
    component: ComponentCreator('/StreamCanvasX/', 'd96'),
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
