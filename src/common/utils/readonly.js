import React from 'react';

import {  
	intCV,
	uintCV,
	trueCV,
	falseCV,
	noneCV,
	someCV,
	stringAsciiCV,
	stringUtf8CV,
	standardPrincipalCV,
	contractPrincipalCV,
	responseErrorCV,
	responseOkCV,
	tupleCV,
	listCV,
	hexToCV,
	cvToHex,

	cvToString,
	stringToCV,
	cvToJSON
} from '@stacks/transactions';
import {callReadOnlyFunction} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

import globals from './globals'



export default {
	
	getLastTokenId: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'get-last-token-id',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	getLastPunkId: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'get_last_punk',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	isOpenMinting: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'is_open_minting',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToString(result) === 'true' )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	isCtxOwner: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling is owner')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'is_nft_contract_owner',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToString(result) === 'true' )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	currentMintEvent: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling current mint event')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'current_mint_event',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	getWhiteListAddresses: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling whitelist')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'whitelist_addresses',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	mintingResume: async (args = [], UserState, cb = null, ecb = null) => {
			console.log('calling minting resume')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'minting_resume',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	getPunk: async (args = {token_id: 0}, UserState, cb = null, ecb = null) => {
			if(!args.token_id) return;
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: globals.CONTRACT_ADDRESS,
				  contractName: globals.CONTRACT_NAME,
				  functionName: 'get-punk',
				  network: globals.NETWORK,
				  functionArgs: [uintCV(args.token_id)],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				console.log('error', e, args)
				if(ecb) ecb(e)
			}
		},
}