import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: 'StreamCanvasX',
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
        name: 'webrtc_wsam_canvas',
        path: 'webrtc_wsam_canvas',
      },
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
