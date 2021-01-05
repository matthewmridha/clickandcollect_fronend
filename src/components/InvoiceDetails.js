import React, { useContext, useState, useEffect } from 'react';
import { 
    Modal,
    Button, 
    ListGroup, 
    ListGroupItem, 
    Row, 
    Col, 
    Table
} from "react-bootstrap";
import { useCookies } from 'react-cookie'
import { trackPromise } from 'react-promise-tracker';
import { URLContext } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Confirm from './Confirm'

function InvoiceDetails( props ) {
    const [ authToken] = useCookies( [ "auth-token" ] );
    const token = authToken[ "auth-token" ];
    const [ products, setProducts ] = useState( [] );
    const [ returnProducts, setReturnProducts] = useState( [] );
    const [ total, setTotal] = useState( "" );
    const [ returnTotal, setReturnTotal] = useState( 0 );
    const [ selectCancel, setSelectCancel ] = useState( false );
    const APIURL = useContext( URLContext );
    const [confirmShow, setConfirmShow] = useState( false );
    const [ confirmMessage, setConfirmMessage ] = useState( "" );
    const [ removeId, setRemoveId ] = useState();
    const [ removeItemQuantity, setRemoveItemQuantity ] = useState( "" );
    
    
        
    useEffect( () => {
        let total = props.products && props.products.map( product => {
            return product.total
        }).reduce(( total, current ) => {
            return parseInt( parseInt( total ) + parseInt( current ) ).toFixed( 2 )
        }, 0);
        setTotal( total )
    },[ props.products ] );

    useEffect( ()=> {
        setProducts( props.products )
    }, [ props.products ] );

    const selectPartial = () => {
        setReturnProducts( [] )
        setSelectCancel( !selectCancel )
    };

    const handleConfirmClose = () => setConfirmShow( false );
    const handleConfirmShow = () => setConfirmShow( true );
      

    const changeStatus = ( status ) => {
        const orderNumber = props.invoice.order_number
        trackPromise(
            fetch( `${APIURL.URL}/change_status/ChangeStatus/`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    "Authorization" : `Token ${ token }`
                },
                body : JSON.stringify({
                orderNumber : orderNumber,
                status : status
                })
            })
            .then(( res ) => {
                if( res.status === 200 ){
                    if( status === "DELIVERED" && props.invoice.payment_method.toUpperCase() === "PAYMENT PENDING" ) {
                        alert(`Please Collect BDT ${ Number( parseFloat(total).toFixed(2) || 0.00 ) } from Customer`)
                        alert(`Status of order ${orderNumber} has been updated to ${status}`)
                    }else{
                        alert(`Status of order ${orderNumber} has been updated to ${status}`)
                    };
                    props.update();
                    props.close();
                }else{
                    alert(`error ${ res.status }`)
                };
            })
        );
    };

    const removeItem = ( id, quantity, barcode, description) => {
        setRemoveItemQuantity( quantity );
        setRemoveId( id );
        setConfirmMessage ( `Are you sure you want to remove ${ barcode } - ${ description } from invoice?` );
        handleConfirmShow();
    }

    const deleteItem = ( id ) => {
        updateQTY( id, removeItemQuantity, "0" );
        handleConfirmClose();
    };

    const updateQTY = ( id, quantity, del=null ) => {
        console.log(del)
        let value = del || document.getElementById( `id${ id }qty` ).value
        if ( value >= quantity || value < 0 ) {
            alert(`Quantity muat be between 0 and ${ quantity - 1 }, is ${value}` )
        } else {
            fetch( `${ APIURL.URL }/product_update/product_update/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    "Authorization" : `Token ${ token }`
                },
                body : JSON.stringify({
                    id : id,
                    quantity : value
                })
            })
            .then(( res )=>{
                if( res.status === 200 ) {
                    props.update();
                } else {
                    alert(`error ${ res.status }`)
                }
            })
            .catch( err => alert( err ) )
        }
        return
        
    }
    
    if ( props.invoice !== null && props.invoice !== undefined ){
        return (
            <Modal
            { ...props }
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            <h4>Order Number { props.invoice.order_number }</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
                    <Confirm 
                        show={ confirmShow } 
                        close={ handleConfirmClose }
                        message={ confirmMessage }
                        argument={ removeId }
                        passedFunction={ deleteItem }
                    />
                    <ListGroup>
                        <ListGroupItem>
                                <div className="invoiceDetailsRow">
                                    <b>Collection Point :</b>
                                    { props.invoice.collection_point }
                                </div>
                            </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                    <b>Customer Name :</b>
                                    { props.invoice.customer_name }
                                </div>
                        </ListGroupItem>
                        <ListGroupItem>
                                <div className="invoiceDetailsRow">
                                    <b>Customer Email :</b> 
                                    { props.invoice.customer_email }
                                </div>
                        </ListGroupItem>
                        <ListGroupItem>
                                <div className="invoiceDetailsRow">
                                    <b>Customer Phone :</b> 
                                    { props.invoice.customer_phone }
                                </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Status :</b> 
                                { props.invoice.status }
                            </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Ivoiced amount :</b> 
                                { props.invoice.invoiced_amount }
                            </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Received Amount :</b> 
                                { props.invoice.received_amount }
                            </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Payment Method :</b> 
                                { props.invoice.payment_method.toUpperCase() }
                            </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Commission Amount :</b> 
                                { props.invoice.commission_amount }
                            </div>
                        </ListGroupItem>
                        <ListGroupItem>
                            <div className="invoiceDetailsRow">
                                <b>Number of Boxes :</b> 
                                { props.invoice.boxes }
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                    <div style={{ overflowX : "scroll" }}>
                        <Table style = {{ overflowX : "scroll" }}>
                            <thead>
                                <tr>
                                    {  selectCancel ? <th>Remove</th> : null }
                                    <th>
                                        Barcode
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Qty
                                    </th>
                                    <th>
                                        Price
                                    </th>
                                    <th>
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { products && products.map(( product ) => {
                                    return(
                                        <tr key={ product.id }>
                                        {   
                                            selectCancel ? 
                                                <td>
                                                    <FontAwesomeIcon icon="trash-alt" 
                                                        onClick = { 
                                                            () => { 
                                                                removeItem( 
                                                                    product.id, 
                                                                    product.quantity, 
                                                                    product.barcode, 
                                                                    product.description 
                                                                )
                                                            }
                                                        }
                                                    />
                                                </td>
                                            : null
                                        }
                                            <td>
                                                { product.barcode }
                                            </td>
                                            <td>
                                                { product.description }
                                            </td>
                                            <td>
                                                { selectCancel ?
                                                <div>
                                                    <input 
                                                        type = 'number' 
                                                        className = "form-control" 
                                                        placeholder = { product.quantity }
                                                        max = { product.quantity }
                                                        min = "0"
                                                        id = { `id${ product.id }qty` }
                                                        >
                                                    </input>
                                                    <Button 
                                                        onClick = { () => updateQTY( product.id, product.quantity ) }
                                                        className = "btn btn-primary"
                                                    >
                                                        Update
                                                    </Button>
                                                </div>
                                                : product.quantity
                                                }
                                            </td>
                                            <td>
                                                { product.price }
                                            </td>
                                            <td>
                                                { product.total }
                                            </td>
                                            
                                        </tr>
                                    )
                                })}
                                <tr>
                                    {
                                    selectCancel ?
                                    <td> </td> 
                                    : null 
                                    }
                                    <td>
                                        <b>Total</b>
                                    </td>
                                    <td>

                                    </td>
                                    <td>

                                    </td>
                                    <td>

                                    </td>
                                    <td>
                                        { (parseFloat( total ).toFixed( 2 ) || 0.00 )}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <Row>
                        <Col>
                            {
                            props.invoice.status === "PROCESSING"  && !props.isHost ?
                                <Button 
                                    variant = "primary" 
                                    onClick = { () => changeStatus( "READY FOR DELIVERY" ) }
                                    disabled = { selectCancel }
                                >
                                    READY FOR DELIVERY
                                </Button> 
                            : null
                            }
                        </Col>
                        <Col>
                            {
                            props.invoice.status === "READY FOR DELIVERY" ? 
                                <Button 
                                    variant = "success"  
                                    onClick = { () => changeStatus( "DELIVERED" ) }
                                >
                                    Complete Delivery
                                </Button>
                            : null
                            }
                        </Col>
                        <Col>
                            {
                            props.invoice.status === "READY FOR DELIVERY" ? 
                                <Button 
                                    variant = "warning" 
                                    onClick = { selectPartial }
                                >
                                    Change QTY
                                </Button>
                            : null
                            }
                        </Col>
                        <Col>
                            {props.invoice.status === "READY FOR DELIVERY"  || (props.isHost && props.invoice.status === "PROCESSING") ? 
                                <Button 
                                    variant = "danger"  
                                    onClick = { () => changeStatus( "CANCELLED" ) }
                                    disabled = { selectCancel }
                                >
                                    Cancel Order
                                </Button> 
                            : null}
                        </Col>
                    </Row>
            </div>
            </Modal.Body>
            </Modal>
        )
    }
    else {
        return(
            null
        )
    }
    
    
}

export default InvoiceDetails;