import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/liveDemoPage'));
const WsmCanvas = lazy(() => import('@/pages/webrtc_wsm_canvas'));
const FlvDemo = lazy(() => import('@/pages/FlvDemo'));
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
      {
        path: '/flvDemo',
        exact: true,
        component: FlvDemo,
      },
    ],
  },
];
export default routerConfig;
