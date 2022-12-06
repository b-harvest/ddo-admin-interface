import AppPage from 'components/AppPage'

export default function TokenLaunch() {
  return (
    <AppPage>
      <div className="flex space-x-3">
        <SetTokenCard tokenType="Base" info={{ ticker: 'bCRE', denom: 'bcre', precision: 6 }} />
        <SetTokenCard tokenType="Quote" info={{ ticker: 'BLD', denom: 'ibc/icecream', precision: 18 }} />
      </div>
    </AppPage>
  )
}

const SetTokenCard = ({
  tokenType,
  info,
}: {
  tokenType: 'Base' | 'Quote'
  info: { ticker: string; denom: string; precision: number }
}) => {
  return (
    <div className="bg-grayCRE-200 dark:bg-neutral-800  !bg-grayCRE-200-o dark:!bg-neutral-800/50 backdrop-blur-[40px] relative flex flex-col p-4 rounded-xl  w-full">
      <div className=" TYPO-BODY-M  mb-4 !font-bold text-center">{tokenType} Token</div>
      <div className="flex items-center mb-3">
        <label htmlFor="pet-select" className="w-20 mr-4 text-sm text-right">
          Ticker :
        </label>

        <select name="pets" id="pet-select" className="h-6 text-black w-[15rem]">
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
      </div>

      <div className="flex items-center mb-3">
        <div className="w-20 mr-4 text-sm text-right">Denom :</div>
        <div className="">
          <input type="text" className="block h-6 w-[15rem]" />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-20 mr-4 text-sm text-right">Precision :</div>
        <div className="">
          <input type="text" className="block h-6 w-[15rem]" />
        </div>
      </div>
    </div>
  )
}
