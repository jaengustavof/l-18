import React, {useContext, useEffect} from 'react';
import './ico.scss';
import Web3 from 'web3';
import * as ICOBSM  from '../../ICOBSM.json';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Context from '../../context';

const Ico = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerTokens, handleSubmit: handleSubmitTokens, formState: { errors: icoTokens } } = useForm();
    const {wallet, logged} = useContext(Context);
    const navigate = useHistory();
    
    useEffect(() => {
        if(!logged) {
            navigate.push("/");
        }
    }, []);
    
    //Contract
    let web3 = new Web3();

    web3.setProvider(
        new web3.providers.HttpProvider('https://sepolia.infura.io/v3/d09825f256ae4705a74fdee006040903')
    );

    let icoContractAddress = "0xc2a619785005517f86a9b79115be839e67a13083"; //Change the address of the deployed contract
    let icoContract = new web3.eth.Contract(ICOBSM.default, icoContractAddress);

    //ICO Methods

    const sendIco = async(amount) => {
        // amount = 1000000000000000
        var rawData = {
            from: wallet.address,
            to: icoContractAddress,
            value: web3.utils.toHex(amount*1000000000000000000),
            gasPrice: web3.utils.toHex(10000000000),
            gasLimit: web3.utils.toHex(1000000),
            nonce: await web3.eth.getTransactionCount(wallet.address),
          };
      
        var signed = await web3.eth.accounts.signTransaction(rawData, wallet.privateKey.toString('hex'));

        web3.eth.sendSignedTransaction(signed.rawTransaction).then(
            receipt => {
                console.log(receipt)
            },
            error => {
                console.log(error)
            }
        );
    }

    const sendIcoTokens = async(to, amount) => {
        // Amount 1000000000000000
        let send = web3.utils.toHex(amount*1000000000000000000);
        let sendTokens = await icoContract.methods.transfer(to, send).encodeABI();
        let rawData = {
            from: wallet.address,
            to: icoContractAddress,
            value: 0,
            gasPrice: web3.utils.toHex(10000000000),
            gasLimit: web3.utils.toHex(1000000),
            nonce: await web3.eth.getTransactionCount(wallet.address),
            data: sendTokens
        }

        let signed = await web3.eth.accounts.signTransaction(rawData, wallet.privateKey.toString('hex'));

        web3.eth.sendSignedTransaction(signed.rawTransaction).then(
            receipt => {
                console.log(receipt)
            },
            error => {
                console.log(error)
            }
        );
        
    } 

    //Form HangleSubmit
    const invest = async (data) =>{
        sendIco(data.invest)
    }

    const sendTokens = async(data) => {
        await sendIcoTokens(data.sendTo, data.amount);
    }

    return (
        <div id='ico-container'>
            <h1>ICO BSM</h1>
            <div className='methods-container'>
                <>
                    <h3>Invest on ICO BSM</h3>
                    <form onSubmit={handleSubmit(invest)}>
                        
                        <input {...register("invest", { required: true })} placeholder='Enter Amount'/>
                        {errors.invest && <span>This field is required</span>}
                        
                        <input type="submit" value="Invest WEI" />

                    </form>          
                </>

                <>
                    <h3>Send ICO Tokens</h3>
                    <form onSubmit={handleSubmitTokens(sendTokens)}>
                        
                        <input {...registerTokens("sendTo", { required: true })} placeholder='Enter Address'/>
                        {errors.sendTo && <span>This field is required</span>}
                        <input {...registerTokens("amount", { required: true })} placeholder='Enter Amount'/>
                        {errors.amount && <span>This field is required</span>}
                        
                        <input type="submit" value="Send ICO TOKENS" />

                    </form>  
                </>
            </div>
        </div>
    );
}

export default Ico;
