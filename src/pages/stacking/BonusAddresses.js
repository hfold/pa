import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
Row,
Col,
List
} from 'reactstrap';

import CodeEditor from '@uiw/react-textarea-code-editor';

import contractCall from '../../common/utils/contractCall';
import {
  UserContext
} from '../../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../../common/utils/readonly';



import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stacking'
import {
  	useParams,
  	useLocation
} from "react-router-dom";


function BonusAddresses (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)

	const [total_to_add, setTotalToAdd] = React.useState(0)
	const [added, setAdded] = React.useState(0)
	const [percentage, setPercentage] = React.useState(null)
	const [daily, setDaily] = React.useState(null)
	const [setting_percentage, setSettingPercentage] = React.useState(false)
	const [address, setAddress] = React.useState('')
	const [raddress, setRAddress] = React.useState('')

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			

		}

	}, []);	

	return <div>
		
		<Row>
		<Col sm={12}>
			<MempoolTxs functions={['add-address-to-bonus','remove-address-from-bonus','set-bonus-percentage']} contract={window.TOKEN_CONTRACT} />
		</Col>
		<Col lg={6} md={6} sm={12}>
			<h3 className="subtitle no-border">Add bonus addresses</h3>
			<FormGroup floating style={{marginTop: 24}}>
				<Input value={percentage} id="add_percentage" onChange={(e)=>setPercentage(e.target.value)} />
				<Label for="add_percentage">
			        Bonus percentage (set to 100 for 1%)
		      	</Label>
			</FormGroup>
			<FormGroup floating style={{marginTop: 24}}>
				<Input type="number" value={daily} id="daily" onChange={(e)=>setDaily(e.target.value)} />
				<Label for="daily">
			        Daily step
		      	</Label>
			</FormGroup>
			<FormGroup floating style={{marginTop: 24}}>
				<Input value={address} id="add_address" onChange={(e)=>setAddress(e.target.value)} />
				<Label for="add_address">
			        Address
		      	</Label>
			</FormGroup>
			<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
				if(adding) return;

				setAdding(true)
				
				stacking.addBonusAddress(
					{ address: address, percentage: percentage, daily: daily },
					UserState,
					doContractCall,
					(res)=>{
						setAdding(false)
						setAddress("")
						setPercentage(null)
						setDaily(null)
						console.log('add res', res)
					},
					(err) => {
						console.log('error', err)
						setAdding(false)
					}
				)
	      		
	      	}}>
				{adding ? <Spinner size="sm" /> : <b>CONFIRM AND ADD</b>}
			</Button>
		</Col>
		<Col lg={6} md={6} sm={12}>
			<h3 className="subtitle no-border">Remove bonus addresses</h3>
			<FormGroup floating style={{marginTop: 24}}>
				<Input value={raddress} id="add_address" onChange={(e)=>setRAddress(e.target.value)} />
				<Label for="add_address">
			        Address
		      	</Label>
			</FormGroup>
			<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
				if(removing) return;

				
				setRemoving(true)
				
				stacking.removeBonusAddress(
					{ address: raddress },
					UserState,
					doContractCall,
					(res)=>{
						setRemoving(false)
						setRAddress("")
					},
					(err) => {
						setRemoving(false)
					}
				)
	      		
	      	}}>
				{removing ? <Spinner size="sm" /> : <b>CONFIRM AND REMOVE</b>}
			</Button>
		
	  	</Col>
	</Row> 
	</div>
}



export default BonusAddresses