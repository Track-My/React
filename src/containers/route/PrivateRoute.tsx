import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppSelector } from '../../lib/hooks';

export default function PrivateRoute({ component, ...rest }: RouteProps) {

    const session = useAppSelector(state => state.session.user);

    if (!session) {
        return <Redirect to="/authentication/" />;
    }

    return <Route component={component} {...rest} />;
}
