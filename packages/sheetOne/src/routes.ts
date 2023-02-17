import { IRouterConfig, lazy } from 'ice';

const Home = lazy(() => import('@/pages/Home'));
const Demo1 = lazy(() => import('@/pages/demo1'));
const SheetPage = lazy(() => import('@/pages/sheetpage'));

const SheetPage2 = lazy(() => import('@/pages/sheetPage2'));

const RacingGame = lazy(() => import('@/pages/cargame'));

const RxjsPage = lazy(() => import('@/pages/rxPage'));

const GridDemo1 = lazy(() => import('@/pages/gird_demo1'));

const ComplexLoad = lazy(() => import('@/pages/complexLoad'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    exact: true,
    component: SheetPage,
  },
  {
    path: '/demo1',
    exact: true,
    component: Demo1,
  },
  {
    path: '/sheetPage',
    exact: true,
    component: SheetPage,
  },
  {
    path: '/sheetPage2',
    exact: true,
    component: SheetPage2,
  },
  {
    path: '/racingGame',
    exact: true,
    component: RacingGame,
  },
  {
    path: '/rxpage',
    exact: true,
    component: RxjsPage,
  },
  {
    path: '/GridDemo1',
    exact: true,
    component: GridDemo1,
  },
  {
    path: '/ComplexLoad',
    exact: true,
    component: ComplexLoad,
  },
];

export default routerConfig;
