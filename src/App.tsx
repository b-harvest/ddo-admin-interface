import 'App.css'
// eslint-disable-next-line no-restricted-imports
import 'react-toastify/dist/ReactToastify.min.css'

import AppHeader from 'components/AppHeader'
import BlockHeightPolling from 'components/BlockHeightPolling'
import GlowBackground from 'components/GlowBackground'
import TextBand from 'components/TextBand'
import useAsset from 'hooks/useAsset'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import Account from 'pages/Account'
import Accounts from 'pages/Accounts'
import AuthRoute from 'pages/AuthRoute'
import Chain from 'pages/Chain'
import DEX from 'pages/DEX'
import LSV from 'pages/LSV'
import LSVs from 'pages/LSVs'
import Overview from 'pages/Overview'
import Pair from 'pages/Pair'
import Pool from 'pages/Pool'
import SignIn from 'pages/SignIn/index'
import Token from 'pages/Token'
import TVL from 'pages/TVL'
import Volume from 'pages/Volume'
import { useEffect, useMemo } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { chainIdAtomRef, userAtomRef } from 'state/atoms'
import StateUpdater from 'state/StateUpdater'
import { formatUSDAmount } from 'utils/amount'
import { isTestnet } from 'utils/chain'

// No interface change
function Updaters() {
  return (
    <>
      <StateUpdater />
    </>
  )
}

function App() {
  // user
  const [userAtom] = useAtom(userAtomRef)

  const { backendBlockHeight, onchainBlockHeight } = useChain()

  // chain
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const isOnTestnet = isTestnet(chainIdAtom)
  const topBannerLabel = isOnTestnet ? `Testnet - ${chainIdAtom}` : `Mainnet`

  // app top bar
  const showAppTopBar = useMemo(() => userAtom && isOnTestnet, [userAtom, isOnTestnet])

  // hidden bar for standalone mode
  const { cre } = useAsset()
  const hiddenBarLabel = useMemo(
    () =>
      cre?.live?.priceOracle
        ? `The last known price of CRE is ${formatUSDAmount({ value: cre?.live?.priceOracle })}`
        : `Visit app.crescent.network for DEX`,
    [cre]
  )

  // scroll behavior by route history
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return (
    <div className="App">
      <Updaters />
      <div className="fixed left-0 right-0 top-0 w-full" style={{ zIndex: '60' }}>
        {showAppTopBar && <TextBand label={topBannerLabel} />}
        {userAtom && (
          <div
            className="flex justify-end bg-white dark:bg-black md:!bg-transparent px-4 py-1 md:py-0 relative md:absolute md:right-4 md:-bottom-8"
            style={{ zIndex: '1' }}
          >
            <BlockHeightPolling
              onchainBlockHeight={onchainBlockHeight ?? '-'}
              backendBlockHeight={backendBlockHeight ?? '-'}
            />
          </div>
        )}
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

          <AuthRoute path="/overview" component={Overview} />
          <AuthRoute path="/chain" component={Chain} />
          <AuthRoute path="/accounts" component={Accounts} />
          <AuthRoute path="/account/:id" component={Account} />
          <AuthRoute path="/account" component={Account} />
          <AuthRoute path="/lsvs" component={LSVs} />
          <AuthRoute path="/lsv/:id" component={LSV} />
          <AuthRoute path="/dex" component={DEX} />

          <AuthRoute path="/volume/:id" component={Volume} />
          <AuthRoute path="/tvl/:id" component={TVL} />
          <AuthRoute path="/token/:id" component={Token} />
          <AuthRoute path="/pair/:id" component={Pair} />
          <AuthRoute path="/pool/:id" component={Pool} />

          <Route>
            <Redirect to="/overview" />
          </Route>
        </Switch>
      </main>

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
  )
}

export default App
