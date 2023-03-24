import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/liveDemoPage'));
const WsmCanvas = lazy(() => import('@/pages/webrtc_wsm_canvas'));
const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        exact: true,
        component: Dashboard,
      },
      {
        path: '/wsmCanvas',
        exact: true,
        component: WsmCanvas,
      },
    ],
  },
];
export default routerConfig;
