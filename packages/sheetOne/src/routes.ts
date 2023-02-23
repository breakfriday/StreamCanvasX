import { IRouterConfig, lazy } from 'ice';

const Home = lazy(() => import('@/pages/Home'));
const Demo1 = lazy(() => import('@/pages/demo1'));
const SheetPage = lazy(() => import('@/pages/sheetpage'));

const SheetPage2 = lazy(() => import('@/pages/sheetPage2'));

const RacingGame = lazy(() => import('@/pages/cargame'));

const RxjsPage = lazy(() => import('@/pages/rxPage'));

const GridDemo1 = lazy(() => import('@/pages/gird_demo1'));

const ComplexLoad = lazy(() => import('@/pages/complexLoad'));

const SlateDemo = lazy(() => import('@/pages/slateDemo'));

const BuildingMap = lazy(() => import('@/pages/buildmap'));


const BuildingMap2 = lazy(() => import('@/pages/builldmap2'));

const BuildingMap3 = lazy(() => import('@/pages/buildmap3'));

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
  {
    path: '/BuildingMap',
    exact: true,
    component: BuildingMap,
  },
  {
    path: '/buildingMap2',
    exact: true,
    component: BuildingMap2,
  },
  {
    path: '/buildingMap3',
    exact: true,
    component: BuildingMap3,
  },
];

export default routerConfig;
