import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/StreamCanvasX/__docusaurus/debug',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug', '655'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/config',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/config', '0e0'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/content',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/content', '228'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/globalData',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/globalData', 'e57'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/metadata',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/metadata', '49b'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/registry',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/registry', '5a7'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/routes',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/routes', '577'),
    exact: true
  },
  {
    path: '/StreamCanvasX/',
    component: ComponentCreator('/StreamCanvasX/', '9fc'),
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
