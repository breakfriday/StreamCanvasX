import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/liveDemoPage'));
const WsmCanvas = lazy(() => import('@/pages/webrtc_wsm_canvas'));

const AudioVisulizer = lazy(() => import('@/pages/AudioVisulizer'));

const HlsDemo = lazy(() => import('@/pages/HlsDemo'));
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
        path: '/audioVisulizer',
        exact: true,
        component: AudioVisulizer,
      },
      {
        path: '/HlsDemo',
        exact: true,
        component: HlsDemo,
      },
    ],
  },
];
export default routerConfig;
