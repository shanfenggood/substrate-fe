// eslint-disable-next-line
import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    /* TODO: 加代码 */
    setFormValue(prev => ({ ...prev, [key]: el.value }));
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>转让</Button>}>
    <Modal.Header>毛孩转让</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- About Kitty Card ---

const KittyCard = props => {
  /*
    TODO: 加代码。这里会 UI 显示一张 `KittyCard` 是怎么样的。这里会用到：
    ```
    <KittyAvatar dna={dna} /> - 来描绘一只猫咪
    <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/> - 来作转让的弹出层
    ```
  */
  const {kitty, owner,  accountPair, setStatus} = props;

  const cardCss = {
    wordBreak:"break-all",
    width:"275px",
    margin:"5px",
  };
  const selfColor = {
    color:"gray",
  };

  let isSelf = '';
  if( owner == accountPair.address){
    kitty.is_owner = true;
  }

  return <Card style={cardCss}>
    <Card.Content>
      <Card.Header>ID {kitty.id}</Card.Header>
      <KittyAvatar dna={kitty.dna} />
      <Card.Description>
        <b>编号: </b>{kitty.id}<br />
        <b>基因: </b>{kitty.dna.join(',')}<br />
        <b>主人: </b>{kitty.is_owner? <span style={selfColor}>(我自己的)</span> : owner}<br />
      </Card.Description>
      { kitty.is_owner &&
      <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
      }
    </Card.Content>
  </Card>;
};

const KittyCards = props => {

  const { kitties, kittyOwners,  accountPair, setStatus } = props;
  const gridCss = {
    margin:"5px",
  };

  return <Grid columns='equal'><Grid.Row stretched>
    {
      kitties.map((kitty, index) => {
        return <Grid.Row key={index}><KittyCard kitty={kitty} owner={kittyOwners[index]} accountPair={accountPair} setStatus={setStatus} /></Grid.Row>
      })
    }
  </Grid.Row>
  </Grid>;
};

export default KittyCards;
