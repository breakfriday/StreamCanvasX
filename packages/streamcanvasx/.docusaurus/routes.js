import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/StreamCanvasX/__docusaurus/debug',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug', 'b88'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/config',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/config', '667'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/content',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/content', 'f39'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/globalData',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/globalData', '445'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/metadata',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/metadata', 'f35'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/registry',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/registry', 'cee'),
    exact: true
  },
  {
    path: '/StreamCanvasX/__docusaurus/debug/routes',
    component: ComponentCreator('/StreamCanvasX/__docusaurus/debug/routes', '2f7'),
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
