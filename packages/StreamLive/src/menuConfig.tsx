import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: 'streamcanvasx',
    icon: <WarningOutlined />,
    children: [
      {
        name: 'simplePage',
        path: '/simpleDemoPage',
      },
      {
        name: 'flv&hls',
        path: '/hlsDemo',
      },
      {
        name: 'customerPlayers',
        path: '/customerPlayers',
      },
      {
        name: 'webrtc_wsam_canvas',
        path: 'webrtc_wsam_canvas',
      },
      {
        name: 'ImageDecoder',
        path: 'ImageDecoder',
      },
      {
        name: 'flvDemux',
        path: 'flvDemux',
      },
      {
        name: 'webgpuRener',
        path: 'webgpuRener',
      },
      {
        name: 'webGlRender',
        path: 'webGLRender',
      },
      {
        name: 'canvasRender',
        path: 'canvasRender',
      },
      {
        name: 'whis&whep',
        path: 'whipwhep',
      },
      {
        name: 'canvasToVideo',
        path: 'canvasToVideo',
      },
      {
        name: 'aacDemo',
        path: 'aacDemo',
      },
      {
        name: 'WebRTCChatHub',
        path: 'WebRTCChatHub',
      },
      {
        name: 'wave',
        path: 'wave',
      },
      {
        name: 'yuvDemo',
        path: 'yuvDemo',
      },
      {
        name: 'yuv2',
        path: 'yuv2',
      }
    ],
  },
  {
    name: 'dashboard',
    path: '/',
    icon: <DashboardOutlined />,
  },
  // {
  //   name: '表单',
  //   path: '/form',
  //   icon: <FormOutlined />,
  // },
  // {
  //   name: '列表',
  //   path: '/list',
  //   icon: <TableOutlined />,
  // },

];

export { asideMenuConfig };
