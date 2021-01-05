import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'react-bootstrap'
import { trackPromise } from 'react-promise-tracker';
import { URLContext } from '..';
import { useCookies } from 'react-cookie'


function Sale ( props ) {
    const [ authToken ] = useCookies( [ "auth-token" ] )
  	const token = authToken[ "auth-token" ]
    const [ sales, setSales ] = useState( [] )
    const [ payer, setPayer ] = useState( "" )
    const [ payAmount, setPayAmount ] = useState( "" )
    const APIURL = useContext( URLContext )

    useEffect( () => {
        getSalesData();
    }, [] )

    const getSalesData = () => {
        fetch(`${APIURL.URL}/sales/`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
                "Authorization" : `Token ${ token }`
            }
        })
        .then(res => res.json())
        .then(res => setSales( res ))
        .catch(error => alert( error ))
    }
    const changePayer = ( e ) => {
        setPayer( e.target.value )
    }

    const handleValueChange = ( e ) => {
        setPayAmount( e.target.value )
    }

    const receivePayment = ( e ) => {
        e.preventDefault();
        trackPromise(
            fetch(`${ APIURL.URL }/sales/settle_cash/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    "Authorization" : `Token ${ token }`
                },
                body : JSON.stringify({
                    profile : payer,
                    amount : payAmount
                })
            })
            .then(( res ) => {
                if( res.status === 200 ){
                    alert( "Payment Updated" );
                    getSalesData();
                }
            })
            .then( setPayAmount( "" ) )
            .then( setPayer( "" ) )
            .catch( err => alert(err) )
        )
    }
    
    return(
        <div style={{ overflowX : "scroll" }}>
            <Table>
                <tr>
                    <th>
                        Profile
                    </th>
                    <th>
                        Total Sales
                    </th>
                    <th>
                        Cash Sales
                    </th>
                    <th>
                        Cash Settled
                    </th>
                    <th>
                        Cash Balance
                    </th>
                </tr>
            { sales && sales.map( row => {
                return (
                    <tr>
                        <td>
                            { row.profile }
                        </td>
                        <td>
                            { row.total_sold }
                        </td>
                        <td>
                            { row.cash_sales }
                        </td>
                        <td>
                            { row.cash_settled }
                        </td>
                        <td>
                            { row.cash_owed }
                        </td>
                    </tr>
                )
            })}
            </Table>
            { props.isHost ? 
                <div>
                    <label for="payee">Received Payment From:</label>
                    <form onSubmit={ receivePayment }>
                        <select 
                            className="form-control" 
                            value={ payer } 
                            id="payer"
                            style={{ marginBottom : "10px" }}
                            onChange={ ( e )=>{ changePayer( e ) }}>
                            <option value="">Select Payee</option>
                            { sales && sales.map( row => {
                                return(
                                    <option 
                                        key={ row.profile } 
                                        value={ row.profile }
                                    >{ row.profile }
                                    </option>
                                )
                            })}
                        </select>
                        <input 
                            className="form-control" 
                            type="number" 
                            value={ payAmount } 
                            onChange={ handleValueChange }
                            placeholder="Amount"
                            style={{ marginBottom : "10px" }}
                            min="0"
                        >
                        </input>
                        <input className="btn btn-primary btn-block" type="submit" value="submit"/>
                    </form>
                </div> 
            : null}
        </div>
    )
}

export default Sale