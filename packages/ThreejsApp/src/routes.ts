import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';


const ThreeCube = lazy(() => import('@/pages/threeCube'));
const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        exact: true,
        redirect: '/threeCube',
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
