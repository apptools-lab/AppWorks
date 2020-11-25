export default (menu) => {
  const asideMenu = [];
  const headerMenu = [];
  const layoutRouter = { path: '/', component: 'BasicLayout', children: [] };

  if (menu.asideMenu) {
    menu.asideMenu.forEach(item => {
      asideMenu.push({ name: item.pageName, path: item.path });
      layoutRouter.children.push({
        path: item.path,
        exact: true,
        page: {
          name: item.pageName,
          blocks: {
            packages: item.blocks.map(block => {
              if (block.source.npm) {
                return block.source.npm;
              }
              return block;
            }),
          },
        },
      });
    });
  }
  if (menu.headerMenu) {
    menu.headerMenu.forEach(item => {
      headerMenu.push({ name: item.pageName, path: item.path });
      layoutRouter.children.push({
        path: item.path,
        exact: true,
        page: {
          name: item.pageName,
          blocks: {
            packages: item.blocks.map(block => block.source.npm),
          },
        },
      });
    });
  }

  return {
    menuConfig: {
      asideMenu,
      headerMenu,
    },
    routersConfig: [layoutRouter],
  };
};
