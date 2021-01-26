// eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    let unsubscribe;
    api.query.kittiesModule.kittiesCount(newValue => {
      // The storage value is an Option<u32>
      // So we have to check whether it is None first
      // There is also unwrapOr
      setKittyCnt(newValue.toNumber());
    }).then(unsub => {
      unsubscribe = unsub;
    })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  };

  const fetchKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    if( kittyCnt == 0 ) return;
    let unsubscribe;
    let ids = [...Array(kittyCnt)].map((v,i)=>i)
    api.query.kittiesModule.kitties.multi(ids,newValue => {

      console.info(newValue)

      let kitties = [];
      newValue.map((item, index) => { kitties.push({id: index, dna: item.unwrap(), is_owner:false}) });
      setKitties(kitties);

    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);
    //
    return () => unsubscribe && unsubscribe();
  };
  const fetchKittyOwners = () => {
    if( kittyCnt == 0 ) return;

    let unsubscribe;
    let _ids = [];
    for (var _i = 0; _i < kittyCnt; _i++) { _ids[_ids.length] = _i; }
    api.query.kittiesModule.kittyOwners.multi(_ids, _owners => {
      let owners = {};
      _owners.map((item, index) => { owners[index] = item.unwrap().toString(); });
      setKittyOwners(owners);
    }).then(unsub => {
      unsubscribe = unsub;
    })
        .catch(console.error);
    return () => unsubscribe && unsubscribe();
  };

  // const fetchKittyPrices = () => {
  //   if( kittyCnt == 0 ) return;
  //
  //   let unsubscribe;
  //   let _ids = [];
  //   for (var _i = 0; _i < kittyCnt; _i++) { _ids[_ids.length] = _i; }
  //   api.query.kittiesModule.kittyPrices.multi(_ids, _prices => {
  //     let prices = {};
  //     _prices.map((item, index) => { prices[index] = item.isNone?0:item.unwrap().toNumber(); });
  //     setKittyPrices(prices);
  //     console.log(prices);
  //   }).then(unsub => {
  //     unsubscribe = unsub;
  //   })
  //       .catch(console.error);
  //   return () => unsubscribe && unsubscribe();
  // };
  // const populateKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
  // };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  // useEffect(populateKitties, [kittyDNAs, kittyOwners]);
  useEffect(fetchKittyOwners, [api, kittyCnt, accountPair]);
  // useEffect(fetchKittyPrices, [api, kittyCnt, accountPair]);
  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <KittyCards kitties={kitties} kittyOwners={kittyOwners} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
