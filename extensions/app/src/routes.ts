import Layout from '@/layouts/BasicLayout';
import MaterialCollection from '@/pages/MaterialCollection';
import Projects from '@/pages/Projects';
// import Settings from '@/pages/Settings';

export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        exact: true,
        component: Projects
      },
      {
        path: '/materialCollection',
        exact: true,
        component: MaterialCollection,
      },
      // {
      //   path: '/Settings',
      //   exact: true,
      //   component: Settings,
      // }
    ]
  }
];
