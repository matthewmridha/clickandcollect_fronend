import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState } from 'react'
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
    const [ selectedDestinationFilter, setSelectedDestinationFilter] = useState( "ALL" )
    const [ filterStatus, setFilterStatus ] = useState( "ALL" )
    const [ filterOrder, setFilterOrder ] = useState( "" )
    const [ filterCustomer, setFilterCustomer ] = useState( "" )
    const [ printShow, setPrintShow ] = useState( false );
    const [ printOrder, setPrintOrder ] = useState( { order : "", name : "", phone : "", point : "", boxes : "", method: "", amount : "" } )

    const changeFilter = ( e ) => {
        setFilterStatus( e.target.value )
    }

    const changeSelectedDestinationFilter = ( e ) => {
        setSelectedDestinationFilter( e.target.value )
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

    const print = ( order, name, collection_point, boxes, method, amount ) => {
        setPrintOrder( {order:order, name:name, collection_point:collection_point, boxes:boxes, method:method, amount:amount });
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
                padding : "50px",
            }}>
               
            <div 
                style = {{ 
                    display: "flex",
                    flexDirection: "column", 
                    paddingBottom: "10px",
                }} >
                <div 
                    id = "invoice-filters"
                >
                    <div>
                    <FontAwesomeIcon icon="filter" style = {{ marginRight: "10px" }}/>
                    <b>Status: </b>
                    <select 
                        onChange = { e => changeFilter( e ) } 
                        value = { filterStatus }
                        className = "form-control filter-input" 
                    >
                        <option value="ALL">ALL</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="READY FOR DELIVERY">Ready For Delivery</option>
                        <option value="CANCELED">Canceled</option>
                    </select>
                    </div>
                    { props.isHost ?
                    <div> 
                    
                    <FontAwesomeIcon icon="filter" style = {{ marginRight: "10px" }}/>
                    <b>Collection Point: </b>
                    <select 
                        value = { selectedDestinationFilter }
                        className = "form-control filter-input" 
                        onChange={e=>changeSelectedDestinationFilter(e)} 
                        
                    >
                        <option value="ALL">ALL</option>
                        { props.destinationFilter && props.destinationFilter.filter( name => {
                            return ( name != props.username )
                        }).map( name => {
                            return (
                                <option key={ name } value={ name }>{ name }</option>
                            )
                        })}
                    </select>
                    </div>
                    : null }

                    <div>
                    <FontAwesomeIcon icon="search" style = {{ marginRight: "10px" }}/>
                    <b>Order#: </b>
                    <input 
                        type = "text" 
                        className = "form-control filter-input"
                        value = { filterOrder } 
                        onChange = { ( e ) => { setFilterOrder( e.target.value )}}
                    />
                    </div>
                    <div>
                    <FontAwesomeIcon icon="search" style = {{ marginRight: "10px" }}/>
                    <b>Customer: </b>
                    <input 
                        type = "text" 
                        className = "form-control filter-input"
                        value = { filterCustomer } 
                        onChange = { ( e ) => { setFilterCustomer( e.target.value )}}
                    />
                    </div>
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
                        if( filterOrder === "" ) {
                            return invoice.order_number
                        } else {
                            const globalRegex = RegExp( filterOrder, 'g' );
                            return globalRegex.test( invoice.order_number )
                        }
                    }).filter( function( invoice ) {
                        if( selectedDestinationFilter === "ALL" ) {
                            return invoice.collection_point
                        } else {
                            return invoice.collection_point === selectedDestinationFilter
                        }
                    }).filter( function( invoice ) {
                        if( filterCustomer === ""){
                            return invoice.customer_name
                        } else {
                            const nameRegex = RegExp( filterCustomer, 'gi')
                            return nameRegex.test( invoice.customer_name )
                        }
                    }).sort( function( a, b )
                        { if ( sort === standardUp ) {
                            return b.order_number - a.order_number 
                        }
                        else if( sort === standardDown ){
                            return a.order_number - b.order_number
                        }
                        else if ( sort === updatedUp ) {
                            return Date.parse( b.updated ) - Date.parse( a.updated ) 
                        }
                        else if ( sort === updatedDown ) {
                            return Date.parse( a.updated ) - Date.parse( b.updated ) 
                        }
                        else if ( sort === createdUp ) {
                            return Date.parse( b.created ) - Date.parse( a.created ) 
                        }
                        else if ( sort === createdDown ) {
                            return Date.parse( a.created ) - Date.parse( b.created ) 
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
                                                invoice.collection_point,
                                                invoice.boxes,
                                                invoice.payment_method,
                                                invoice.invoiced_amount,
                                            ) 
                                        }
                                        style={{ paddingLeft : "10px", paddingRight : "10px", width : "200px"}}
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