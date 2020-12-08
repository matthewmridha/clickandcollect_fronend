import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useState } from 'react';

function InvoiceList( props ){

    const invoiceClicked = invoice => event => {
        props.invoiceClicked( invoice )
    }
    const [ filterStatus, setFilterStatus ] = useState( "ALL" )
    const [ filterOrder, setFilterOrder ] = useState( "" )
    const [ filterCustomer, setFilterCustomer ] = useState( "" )
    const changeFilter = (e) => {
        setFilterStatus(e.target.value)
    }
    
    return(
        <div 
            className="container container-fluid"
            style={{ overflowX : "scroll" }}>
            <div 
                style = {{ 
                    display: "flex",
                    flexDirection: "column", 
                    paddingBottom: "20px" 
                }} >
                <div>
                    <FontAwesomeIcon icon="filter" />
                    <b>Order Status :</b>
                    <select 
                        onChange = { e => changeFilter( e ) } 
                        value = { filterStatus }
                        className = "form-control" 
                    >
                        <option value="ALL">ALL</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="PROCESSING">Processessing</option>
                        <option value="READY FOR DELIVERY">Ready For Delivery</option>
                        <option value="CANCELED">Cancelled</option>
                    </select>
                </div>
                <div 
                    style = {{   
                        display: "flex" ,
                        justifyContent: "flex-start" , 
                        overflowX : "scroll"
                    }} >
                    <FontAwesomeIcon icon="search" />
                    <b>Order #: </b>
                    <input 
                        type = "text" 
                        className = "form-control"
                        value = { filterOrder } 
                        onChange = { ( e ) => { setFilterOrder( e.target.value )}}
                        style = {{ marginRight: "10px" }}
                    />
                    <b>Customer: </b>
                    <input 
                        type = "text" 
                        className = "form-control"
                        value = { filterCustomer } 
                        onChange = { ( e ) => { setFilterCustomer( e.target.value )}}
                    />
                </div>
            </div>
            <table 
                className="table table-sm table-bordered table-hover"
            >
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
                    { props.invoices && props.invoices.filter( function( invoice ) {
                        if( filterStatus === "ALL" ) {
                            return invoice.status
                        } else {
                            return invoice.status === filterStatus
                        }
                    }).filter( function( invoice ) {
                        if( filterOrder === "") {
                            return invoice.order_number
                        } else {
                            const globalRegex = RegExp( filterOrder, 'g' );
                            return globalRegex.test( invoice.order_number )
                        }
                    }).filter( function( invoice ) {
                        if( filterCustomer === ""){
                            return invoice.customer_name
                        } else {
                            return invoice.customer_name.toUpperCase() === filterCustomer.toUpperCase()
                        }
                    }).sort( function( a, b )
                        { return b.order_number - a.order_number } ).map( function( invoice ) {
                            return (
                                <tr className = 'invoiceList' 
                                    onClick = { invoiceClicked( invoice ) } 
                                    key = { invoice.id } >
                                    <td>
                                    { invoice.order_number }
                                    </td>
                                    <td>
                                    { invoice.collection_point }
                                    </td>
                                    <td>
                                    { invoice.customer_name }
                                    </td>
                                    <td>
                                    { invoice.status }
                                    </td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
        </div>
    )
}

export default InvoiceList