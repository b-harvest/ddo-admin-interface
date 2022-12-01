import { useAtom } from 'jotai'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { authTokenAtomRef } from 'state/atoms'

interface AuthRouteProps {
  component: () => JSX.Element
  path: string
}

export default function AuthRoute({ component, path }: AuthRouteProps) {
  const [authTokenAtom] = useAtom(authTokenAtomRef)

  const location = useLocation()

  return (
    <Route exact path={path} component={component}>
      {authTokenAtom ? null : (
        <Redirect
          to={{
            pathname: '/auth',
            state: { from: location },
          }}
        />
      )}
    </Route>
  )
}
