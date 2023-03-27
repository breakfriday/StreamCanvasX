import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/liveDemoPage'));
const WsmCanvas = lazy(() => import('@/pages/webrtc_wsm_canvas'));
const FlvDemo = lazy(() => import('@/pages/FlvDemo'));
const AudioVisulizer = lazy(() => import('@/pages/AudioVisulizer'));
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
      {
        path: '/audioVisulizer',
        exact: true,
        component: AudioVisulizer,
      },
    ],
  },
];
export default routerConfig;
