import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useState } from 'react';
import Print from './Print';
import { PaginatedList } from 'react-paginated-list';
import { AnyStyledComponent } from 'styled-components';

function InvoiceList( props ){

    const standardUp = "standardUp";
    const standardDown = "standardDown";
    const updatedUp = "updatedUp";
    const updatedDown = "updatedDown";
    const createdUp = "createUp";
    const createdDown = "createdDown";

    const invoiceClicked = invoice => event => {
        props.invoiceClicked( invoice )
    }

    const [ sort, setSort ] = useState( standardUp )
    const [ filterStatus, setFilterStatus ] = useState( "ALL" )
    const [ filterOrder, setFilterOrder ] = useState( "" )
    const [ filterCustomer, setFilterCustomer ] = useState( "" )
    const [ printShow, setPrintShow ] = useState( false );
    const [ printOrder, setPrintOrder ] = useState( { order : "", name : "", phone : "", point : "", boxes : "", method: "", amount : "" } )

    const changeFilter = ( e ) => {
        setFilterStatus( e.target.value )
    }

    const changeSort = ( type = standardUp ) => {
        if ( type === "updated" ){
            if ( sort == updatedUp ){
                setSort(updatedDown)
            }
            else {
                setSort(updatedUp)
            }
        }
        else if ( type === "created" ) {
            if ( sort == createdUp ) {
                setSort( createdDown )
            }
            else {
                setSort( createdUp )
            }
        }
        else {
            if ( sort == standardUp ) {
                setSort( standardDown )
            }
            else {
                setSort ( standardUp )
            }
        }
    }

    const print = ( order, name, phone, point, boxes, method, amount ) => {
        setPrintOrder( {order:order, name:name, phone:phone, point:point, boxes:boxes, method:method, amount:amount });
        handlePrintShow();
    }
    const handlePrintShow = () => setPrintShow( true );
    const handlePrintClose = () => setPrintShow( false );
    
    
    return(
        <div>
            <Print
                show={ printShow } 
                close={ handlePrintClose }
                invoice={ printOrder }
            />
        <div 
            className="container container-fluid"
            style={{ 
                overflowX : "scroll", 
                maxHeight : "50vh", 
                overflowY : "scroll",
                padding : "10px",
                
            }}>
               
            <div 
                style = {{ 
                    display: "flex",
                    flexDirection: "column", 
                    paddingBottom: "20px"
                }} >
                <div style={{ margin: "10px" }}>
                    <FontAwesomeIcon icon="filter" style = {{ marginRight: "10px" }}/>
                    <b>Order Status :</b>
                    <select 
                        onChange = { e => changeFilter( e ) } 
                        value = { filterStatus }
                        className = "form-control" 
                    >
                        <option value="ALL">ALL</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="READY FOR DELIVERY">Ready For Delivery</option>
                        <option value="CANCELED">Cancelled</option>
                    </select>
                </div>
                <div 
                    style = {{   
                        display: "flex" ,
                        justifyContent: "flex-start" ,
                        alignItems : "center", 
                        margin: "10px",
                        overflowX : "scroll"
                    }} >
                    <FontAwesomeIcon icon="search" style = {{ marginRight: "10px" }}/>
                    <b>Order#: </b>
                    <input 
                        type = "text" 
                        className = "form-control"
                        value = { filterOrder } 
                        onChange = { ( e ) => { setFilterOrder( e.target.value )}}
                        style = {{ margin: "10px" }}
                    />
                    <FontAwesomeIcon icon="search" style = {{ marginRight: "10px" }}/>
                    <b>Customer: </b>
                    <input 
                        type = "text" 
                        className = "form-control"
                        value = { filterCustomer } 
                        onChange = { ( e ) => { setFilterCustomer( e.target.value )}}
                        style = {{ margin: "10px" }}
                    />
                </div>
            </div>
            <table 
                className="table table-sm table-bordered table-hover"
            >
                <thead>
                    <tr>
                        <th onClick = { () => { changeSort( "standard" ) } }>
                            Order
                            {" "}
                            <FontAwesomeIcon icon="sort"/>
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
                        <th onClick = { () => { changeSort( "created" ) } }>
                            Created
                            {" "}
                            <FontAwesomeIcon icon="sort"/>
                        </th>
                        <th onClick = { () => { changeSort( "updated" ) } }>
                            Last Updated
                            {" "}
                            <FontAwesomeIcon icon="sort"/>
                        </th>
                        { props.isHost ? <th></th> : null }
                    </tr>
                </thead>
                <tbody>
                    {/*
                <PaginatedList
                list={props.invoices}
                itemsPerPage={5}
                renderList={(list) => (
                    <>
                      {list.map((item, id) => {
                        return (
                          <div key={id}>
                            {item.a} {item.b}
                          </div>
                        );
                      })}
                    </>
                  )}
                    />*/}

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
                            const nameRegex = RegExp( filterCustomer, 'gi')
                            return nameRegex.test(invoice.customer_name)
                        }
                    }).sort( function( a, b )
                        { if ( sort === standardUp ) {
                            return b.order_number - a.order_number 
                        }
                        else if( sort === standardDown ){
                            return a.order_number - b.order_number
                        }
                        else if ( sort === updatedUp ) {
                            return Date.parse(b.updated) - Date.parse(a.updated) 
                        }
                        else if ( sort === updatedDown ) {
                            return Date.parse(a.updated) - Date.parse(b.updated) 
                        }
                        else if ( sort === createdUp ) {
                            return Date.parse(b.created) - Date.parse(a.created) 
                        }
                        else if ( sort === createdDown ) {
                            return Date.parse(a.created) - Date.parse(b.created) 
                        }
                    }).map( function( invoice ) {
                            return (
                                <tr className = 'invoiceList' 
                                    key = { invoice.id } >
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.order_number }
                                    </td>
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.collection_point }
                                    </td>
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.customer_name }
                                    </td>
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.status }
                                    </td>
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.created }
                                    </td>
                                    <td onClick = { invoiceClicked( invoice ) } >
                                    { invoice.updated }
                                    </td>
                                    { props.isHost ? 
                                    <td 
                                        onClick={ 
                                            () => print( 
                                                invoice.order_number, 
                                                invoice.customer_name,
                                                invoice.customer_phone,
                                                invoice.collection_point,
                                                invoice.boxes,
                                                invoice.payment_method,
                                                invoice.invoiced_amount
                                            ) 
                                        }
                                    >
                                        <FontAwesomeIcon 
                                            icon="print" 
                                        />
                                    </td>
                                    : null }
                                </tr>
                            )
                        })
                    }
                  
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default InvoiceList