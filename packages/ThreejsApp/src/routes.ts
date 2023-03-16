import { IRouterConfig, lazy } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';


const ThreeCube = lazy(() => import('@/pages/threeCube'));
const ThreeCubeIoc = lazy(() => import('@/pages/threeCubeIoc'));
const BuildMap = lazy(() => import('@/pages/buildMap'));
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
      {
        path: '/threeCubeIoc',
        exact: true,
        component: ThreeCubeIoc,
      },
      {
        path: '/buildMap',
        exact: true,
        component: BuildMap,
      },
    ],
  },
];
export default routerConfig;
