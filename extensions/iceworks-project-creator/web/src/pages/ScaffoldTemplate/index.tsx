import React from 'react';
import { createBrowserHistory } from 'ice';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import path from 'path';
import routes from './routerConfig';

const history = createBrowserHistory();

const RouteItem = (props: any) => {
  const { redirect, path: routePath, component: Component, key, exact } = props;
  if (redirect) {
    return <Redirect exact key={key} from={routePath} to={redirect} />;
  }
  return (
    <Route
      key={key}
      exact={exact}
      render={componentProps => (
        <Component {...componentProps} />
      )}
      path={routePath}
    />
  );
};

const TemplateRouter = () => {
  return (
    <Router history={history}>
      <Switch>
        {routes.map((route, id) => {
          const { component: RouteComponent, children, ...others }: any = route;
          return (
            <Route
              key={id}
              {...others}
              component={props => {
                return Array.isArray(children) && children ? (
                  <RouteComponent key={id} {...props}>
                    <Switch>
                      {children.map((routeChild, idx) => {
                        const { path: childPath, ...restProps } = routeChild;
                        return RouteItem({
                          key: `${id}-${idx}`,
                          path: childPath && path.join(route.path, childPath),
                          ...restProps,
                        });
                      })}
                    </Switch>
                  </RouteComponent>
                ) : (<>{RouteItem({ key: id, ...props })} </>);
              }}
            />
          );
        })}
      </Switch>
    </Router>
  );
};

export default TemplateRouter;
