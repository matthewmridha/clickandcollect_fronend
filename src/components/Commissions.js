import React, {useState, useEffect, useContext} from 'react'
import { Table } from 'react-bootstrap'
import { trackPromise } from 'react-promise-tracker';
import { URLContext } from '..';
import { useCookies } from 'react-cookie'


function Commission ( props ) {
    const [authToken] = useCookies(["auth-token"])
  	const token = authToken["auth-token"]
    const [commissions, setCommissions] = useState([])
    const [payee, setPayee] = useState("")
    const [payAmount, setPayAmount] = useState("")
    const APIURL = useContext(URLContext)

    useEffect( () => {
        getCommissionData();
    }, [])

    const getCommissionData = () => {
        fetch(`${APIURL.URL}/commissions/`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
                "Authorization" : `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(res => setCommissions(res))
        .catch(error => console.log(error))
    }
    const changePayee = ( e ) => {
        setPayee( e.target.value )
    }

    const handleValueChange = ( e ) => {
        setPayAmount( e.target.value )
    }

    const makePayment = ( e ) => {
        e.preventDefault();
        trackPromise(
            fetch(`${APIURL.URL}/commissions/pay_commissions/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    "Authorization" : `Token ${token}`
                },
                body : JSON.stringify({
                    profile : payee,
                    amount : payAmount
                })
            })
            .then((res) => {
                if(res.status === 200){
                    alert("Payment Updated");
                    getCommissionData();
                }
            })
            .then(setPayAmount(""))
            .then(setPayee(""))
            .catch(err => console.log(err))
        )
    }
    
    return(
        <div>
            <Table>
                <tr>
                    <th>
                        Profile
                    </th>
                    <th>
                        Commission Made
                    </th>
                    <th>
                        Commission Paid
                    </th>
                    <th>
                        Commission Due
                    </th>
                </tr>
            {commissions && commissions.map(row => {
                return (
                    <tr>
                        <td>
                            {row.profile}
                        </td>
                        <td>
                            {row.commission_made}
                        </td>
                        <td>
                            {row.commission_paid}
                        </td>
                        <td>
                            {row.commission_due}
                        </td>
                    </tr>
                )
            })}
            </Table>
            { props.isHost ? 
                <div>
                    <form onSubmit={makePayment}>
                        <select 
                            className="form-control" 
                            value={ payee } 
                            onChange={ ( e )=>{ changePayee( e ) }}>
                            <option value=""></option>
                            { commissions && commissions.map( row => {
                                return(
                                    <option 
                                        key={ row.profile } 
                                        value={ row.profile }
                                    >{row.profile}
                                    </option>
                                )
                            })}
                        </select>
                        <input 
                            className="form-control" 
                            type="number" 
                            value={ payAmount } 
                            onChange={ handleValueChange }>

                        </input>
                        <input className="btn btn-primary btn-block" type="submit" value="submit"/>
                    </form>
                </div> 
            : null}
        </div>
    )
}

export default Commission