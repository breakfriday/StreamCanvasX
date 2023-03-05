import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));

const ThreeCube = lazy(() => import('@/pages/threeCube'));
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
        path: '/threeCube',
        exact: true,
        component: ThreeCube,
      },
    ],
  },
];
export default routerConfig;
