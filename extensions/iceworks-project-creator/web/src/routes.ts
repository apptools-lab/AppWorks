import CreateProject from '@/pages/CreateProject';
import CustomScaffold from '@/pages/CreateProject/components/CustomScaffold';

const routerConfig = [
  {
    path: '/customScaffold',
    component: CustomScaffold,
  },
  {
    path: '/',
    component: CreateProject,
  },
];

export default routerConfig;
