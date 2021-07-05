import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import history from "./history";
import { useGrant } from "@/utils/react_custom_use";
import _ from "underscore";

/**
 * 路由组件
 * @param {*} props 
 * @returns 
 */
const AppRoutes = (props) => {
  const { routes, permission } = props;
  const grant = useGrant();
  const permissionRoutes = routes.filter((item) => {
    return grant.get(item.permission, item.license);
  });
  let redirectRoute = routes.filter((item) => item.redirect === true)[0];
  if (_.isEmpty(permission)) {
    return null;
  }
  if (redirectRoute && redirectRoute.routes) {
    redirectRoute = redirectRoute.routes[0];
  }
  return (
    <Switch>
      {permissionRoutes.map((item, index) => {
        let { path, exact, component, routes = [] } = item;
        let Com = component;

        return (
          <Route path={path} exact={exact} key={index}>
            <Com history={history} routes={routes} />
          </Route>
        );
      })}
      {redirectRoute ? <Redirect to={redirectRoute.path} /> : null}
    </Switch>
  );
};

export { AppRoutes };
