import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useState, useEffect } from 'react';

function InvoiceList(props){
    const [commissionAmount, setCommissionAmoun] = useState("")
    const invoiceClicked = invoice => event => {
        props.invoiceClicked(invoice)
    }
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [filterOrder, setFilterOrder] = useState("")
    const [filterCustomer, setFilterCustomer] = useState("")
    const changeFilter = (e) => {
        setFilterStatus(e.target.value)
    }
    const calculateCommission = () => {
        let commissionArray = []
        for(let i=0; i<props.invoices.length; i++){
            commissionArray.push(props.invoices[i].commission_amount)
        }
        let total = parseFloat(commissionArray.reduce((a,b)=>{return a + parseFloat(b)},0)).toFixed(2)
        setCommissionAmoun(total)
    }
    useEffect(()=>{
        calculateCommission()
    })
    return(
        <div className="container container-fluid">
            <div style={{display: "flex" , flexDirection: "column", paddingBottom: "20px" }}>
                <div>
                    <FontAwesomeIcon icon="filter" />
                    <b>Order Status :</b>
                    <select onChange={ e => changeFilter( e ) } value={ filterStatus }>
                        <option value="ALL">ALL</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="PROCESSING">Processessing</option>
                        <option value="READY FOR DELIVERY">Ready For Delivery</option>
                        <option value="CANCELED">Cancelled</option>
                    </select>
                </div>
                <div style={{ display: "flex" , justifyContent: "flex-start" }}>
                    <FontAwesomeIcon icon="search" />
                    <b>Order #: </b>
                    <input 
                        type="text" 
                        value={ filterOrder } 
                        onChange={ ( e ) => { setFilterOrder( e.target.value )}}
                        style={{ marginRight: "10px" }}
                    />
                    <b>Customer: </b>
                    <input 
                        type="text" 
                        value={ filterCustomer } 
                        onChange={ ( e ) => { setFilterCustomer( e.target.value )}}
                    />
                </div>
            </div>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>
                            Order
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Customer
                        </th>
                        <th>
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.invoices && props.invoices.filter( function( invoice ) {
                        if( filterStatus === "ALL" ) {
                            return invoice.status
                        } else {
                            return invoice.status === filterStatus
                        }
                    }).filter( function( invoice ) {
                        if( filterOrder === ""){
                            return invoice.order_number
                        } else {
                            return invoice.order_number === filterOrder
                        }
                    }).filter( function( invoice ) {
                        if( filterCustomer === ""){
                            return invoice.customer_name
                        } else {
                            return invoice.customer_name === filterCustomer
                        }
                    }).sort( function( a, b )
                        { return b.order_number - a.order_number } ).map( function( invoice ) {
                            return (
                                <tr className='invoiceList' onClick={invoiceClicked(invoice)} key={invoice.id}>
                                    <td>
                                    {invoice.order_number}
                                    </td>
                                    <td>
                                    {invoice.collection_point}
                                    </td>
                                    <td>
                                    {invoice.customer_name}
                                    </td>
                                    <td>
                                    {invoice.status}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
            
            <div>
            {!props.isHost ? 
                <p>
                    Total Commission Made = BDT {commissionAmount} 
                </p>
            : null}    
                
            <div>
                    
                </div>
            </div>
        </div>
    )
}

export default InvoiceList