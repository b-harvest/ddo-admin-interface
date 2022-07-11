import { useAtom } from 'jotai'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { userAtomRef } from 'state/atoms'

interface AuthRouteProps {
  component: () => JSX.Element
  path: string
}

export default function AuthRoute({ component, path }: AuthRouteProps) {
  const [userAtom] = useAtom(userAtomRef)
  const location = useLocation()

  return (
    <Route exact path={path} component={component}>
      {userAtom ? null : (
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
