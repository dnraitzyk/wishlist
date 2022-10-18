import React, { useEffect } from 'react';
import { SwitchDB } from './apis'

function MainHeader(props) {
  const { useProdDB, setUseProdDB } = props

  useEffect(() => {

  }, []);

  const handleSwitch = (event) => {
    setUseProdDB(!useProdDB)
    if (!useProdDB) {
      SwitchDB({ db: "prod" })
    }
    else {
      SwitchDB({ db: "dev" })
    }
  }


  return (
    <div className="mainHeader">
      {/* <button className="typicalbutton headercomponent" type="button" onClick={(e) => handleSwitch(e)}>
        Use prod db
      </button> */}
      <div className="custom-control custom-switch headercomponent">
        <input type="checkbox" className="custom-control-input" id="customSwitchdb" defaultValue={false} checked={useProdDB} onChange={(e) => handleSwitch(e)} />
        <label className="custom-control-label" htmlFor="customSwitchdb">Use prod db switch
        </label>
      </div>
    </div>
  )

};
export default MainHeader;
