import 'App.css'
// eslint-disable-next-line no-restricted-imports
import 'react-toastify/dist/ReactToastify.min.css'

//import Analytics from 'analytics/Analytics'
import AppHeader from 'components/AppHeader'
// import BlockHeightPolling from 'components/BlockHeightPolling'
import GlowBackground from 'components/GlowBackground'
import Loader from 'components/Loader'
import TextBand from 'components/TextBand'
import useAsset from 'hooks/useAsset'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import Account from 'pages/Account'
// import Accounts from 'pages/Accounts'
import Accounts from 'pages/Vo/Accounts'
import AuthRoute from 'pages/AuthRoute'
import Chain from 'pages/Chain'
import DEX from 'pages/DEX'
import LSV from 'pages/LSV'
import LSVs from 'pages/LSVs'
//import Overview from 'pages/Overview'
import Overview from 'pages/Vo/Overview'
import Pair from 'pages/Pair'
import Pool from 'pages/Pool'
import SignIn from 'pages/SignIn/index'
import Token from 'pages/Token'
import TokenLaunch from 'pages/TokenLaunch'
import TVL from 'pages/TVL'
import Volume from 'pages/Volume'
import { useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { authTokenAtomRef, chainIdAtomRef } from 'state/atoms'
import StateUpdater from 'state/StateUpdater'
import { formatUSDAmount } from 'utils/amount'
import { isTestnet } from 'utils/chain'
import { isJwtExpired } from 'utils/jwt'

function Updaters() {
  return (
    <>
      <StateUpdater />
    </>
  )
}

function App() {
  /** @summary scroll behavior by route history */
  const history = useHistory()
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  /** @summary google auth */
  const [authTokenAtom, setAuthTokenAtom] = useAtom(authTokenAtomRef)
  const [authChecked, setAuthChecked] = useState<boolean>(false)

  useEffect(() => {
    if (!authChecked) {
      if (authTokenAtom !== null && isJwtExpired(authTokenAtom)) {
        setAuthTokenAtom({ authToken: null })
      }
      setAuthChecked(true)
    }
  }, [])

  /** @summary block height */
  const { backendBlockHeight, onchainBlockHeight } = useChain()

  /** @summary chain */
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const isOnTestnet = isTestnet(chainIdAtom)
  const topBannerLabel = isOnTestnet ? `Testnet - ${chainIdAtom}` : `Mainnet`

  /** @summary app top bar */
  const showAppTopBar = useMemo(() => authTokenAtom && isOnTestnet, [authTokenAtom, isOnTestnet])

  /** @summary hidden bar for standalone mode */
  const { cre } = useAsset()
  const hiddenBarLabel = useMemo(
    () =>
      cre?.live?.priceOracle
        ? `The last known price of CRE is ${formatUSDAmount({ value: cre?.live?.priceOracle })}`
        : `Visit app.crescent.network for DEX`,
    [cre]
  )

  return (
    <>
      <div className="App">
        {/* <Analytics /> */}
        <Updaters />

        {authChecked ? (
          <>
            <div className="fixed top-0 left-0 right-0 w-full" style={{ zIndex: '60' }}>
              {/* 체인명 보여주는 빨간색 탭 */}
              {/* {showAppTopBar && <TextBand label={topBannerLabel} />} */}
              {/* {authTokenAtom && (
                <div
                  className="flex justify-end bg-white dark:bg-black md:!bg-transparent px-4 py-1 md:py-0 relative md:absolute md:right-4 md:-bottom-8"
                  style={{ zIndex: '1' }}
                >
                  <BlockHeightPolling
                    onchainBlockHeight={onchainBlockHeight ?? '-'}
                    backendBlockHeight={backendBlockHeight ?? '-'}
                  />
                </div>
              )} */}
              <AppHeader />
            </div>

            <main role="main" className={showAppTopBar ? 'MAIN-TOP-BAR' : 'MAIN'}>
              <div className="absolute top-0 left-0 right-0">
                <TextBand label={hiddenBarLabel} thin={true} bgColorClass="bg-info" />
              </div>

              <GlowBackground
                style={{
                  transform: 'translateY(-120vh) translateX(-50vw)',
                }}
              />
              <GlowBackground
                style={{
                  transform: 'translateY(25vh) translateX(75vw)',
                }}
              />

              <Switch>
                <Route exact path="/auth" component={SignIn} />
                {/* <Route exact path="/google-sign-in" component={GoogleSignIn} /> */}

                <AuthRoute path="/vo/overview" component={Overview} />
                <AuthRoute path="/chain" component={Chain} />
                <AuthRoute path="/vo/accounts" component={Accounts} />
                <AuthRoute path="/account/:id" component={Account} />
                <AuthRoute path="/account" component={Account} />
                <AuthRoute path="/lsvs" component={LSVs} />
                <AuthRoute path="/lsv/:id" component={LSV} />
                <AuthRoute path="/dex" component={DEX} />
                <AuthRoute path="/token-launch" component={TokenLaunch} />

                <AuthRoute path="/volume/:id" component={Volume} />
                <AuthRoute path="/tvl/:id" component={TVL} />
                <AuthRoute path="/token/:id" component={Token} />
                <AuthRoute path="/pair/:id" component={Pair} />
                <AuthRoute path="/pool/:id" component={Pool} />

                <Route>
                  <Redirect to="/vo/overview" />
                </Route>
              </Switch>
            </main>
          </>
        ) : (
          <div className="w-screen h-screen" title="Verifying if authorized">
            <Loader />
          </div>
        )}

        <ToastContainer
          limit={3}
          transition={Slide}
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          closeOnClick
          closeButton={() => <div>𝗫</div>}
          toastClassName={'bg-white text-black dark:bg-black dark:text-white TYPO-BODY-M text-left'}
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      </div>
    </>
  )
}

export default App
