import React, {useContext, useState} from 'react';
import { Form, Modal, Button, Col, Table } from 'react-bootstrap'
import { trackPromise } from 'react-promise-tracker';
import AlertDismissible from './alert'
import LoadingIndicator from './LoadingIndicator';
import { useCookies } from 'react-cookie'
import { URLContext } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CreateInvoice(props) {

  const [authToken] = useCookies(["auth-token"])
  const token = authToken["auth-token"]
  const APIURL = useContext(URLContext) 

  const [orderNumber, setOrderNumber] = useState( "" )
  const [customerName, setCustomerName] = useState( "" )
  const [customerEmail, setCustomerEmail] = useState( "" )
  const [customerPhone, setCustomerPhone] = useState( "" )
  const [destination, setDestination] = useState( "" )
  const [itemInput, setItemInput] = useState( "" )
  const [products, setProducts] = useState([])
  const [matchedBarcode, setMatchedBarcode] = useState( false )
  const [quantityInput, setQuantityInput] = useState( 1 )
  const [tempIndex, settempIndex] = useState()
  const [paymentMethod, setPaymentMethod] = useState( "PAYMENT PENDING" )
  const [showAlert, setShowAlert] = useState( false )
  const [alertHeader, setAlertHeader] = useState( "" )
  const [alertMessage, setAlertMessage] = useState( "" )
  const [discountInput, setDiscountInput] = useState( "0" )
  const [boxes, setBoxes] = useState( "1" )
  const [invoiceDiscount, setInvoiceDiscount] = useState( "0" )
  
  const changeInput = ( e, targetState ) => {
    targetState( e.target.value )
  }
  
  const changeDestination = ( e ) => {
    setDestination( e.target.value )
  }
  
  const checkItemCode = ( e ) => {
    let inputItemBarcode = e.target.value.toUpperCase();
    if( inputItemBarcode.length > 5 && inputItemBarcode.charAt( 0 ) === "A" ){
      for( let i = 0; i < props.items.length; i++ ) {
        if( inputItemBarcode === props.items[ i ][ "barcode" ] ){
          setMatchedBarcode( true )
          settempIndex( i ) 
        }
      }
    } else {
      return
    }
  }
  
  const clearAndUpdateList = () => {
    setItemInput("")
    setQuantityInput(1)
    setMatchedBarcode(false)
    settempIndex()
    setDiscountInput(0)
  }
  const clearForm = () => {
    setOrderNumber("")
    setCustomerName("")
    setCustomerEmail("")
    setCustomerPhone("")
    setDestination("")
    setBoxes("1")
    setPaymentMethod("PAYMENT PENDING")
    setInvoiceDiscount("0")
  }
  
  const addItemToList = () => {
    for(let i = 0; i < products.length; i++){
      if(products[i]['barcode'] === itemInput){
        products[i]["quantity"] += parseInt(quantityInput)
        clearAndUpdateList()
        return
      }
    }
    let description = props.items[tempIndex]["description"]
    let price = parseFloat(props.items[tempIndex]["price"]) - (parseFloat(discountInput) || 0)
    let itemToBeAdded = {barcode: itemInput, description: description, quantity: quantityInput, price:price}
    setProducts([...products, itemToBeAdded])
    clearAndUpdateList()
  }

  const closeAlert = () => {
    setShowAlert( false )
    setAlertHeader()
    setAlertMessage()
  }

  const removeitem = ( barcode ) => {
    let tempProductsArray = [...products]
    for( let i = 0; i < tempProductsArray.length; i++ ){
      if ( tempProductsArray[i].barcode === barcode ){
        tempProductsArray.splice( i, 1 )
      }
    }
    setProducts( tempProductsArray )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(products.length > 0){
      trackPromise(
        fetch(`${APIURL.URL}/invoice/create_invoice/`,{
          method : "POST",
          headers : {
            "Content-Type" : "application/json",
            'Accept': 'application/json',
            "Authorization" : `Token ${token}`
          },
          body : JSON.stringify({
            orderNumber : orderNumber,
            customerName : customerName,
            customerEmail : customerEmail,
            customerPhone: customerPhone,
            partnerName : destination,
            paymentMethod : paymentMethod,
            items : products,
            boxes : boxes,
            invoiceDiscount : invoiceDiscount
          })
        })
        .then(( res ) => {
          if( res.status === 200 ){
            alert(`Invoice ${orderNumber} Created`);
            props.update();
            setProducts([]);
          }
          res = res.json();
        })
        .then(clearForm())
        .catch(err => console.log(err))
      )
    }else{
      alert("No items added to invoice")
    }
  }
    return(
      <div>
        {showAlert ? 
        <AlertDismissible closeAlert={closeAlert} 
                          alertHeader={alertHeader}
                          alertMessage={alertMessage}
                          />
        : null }
        <LoadingIndicator />              
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Order
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="orderNumberInput">
                <Form.Label>Order Number</Form.Label>
                <Form.Control type="text" 
                              onChange={e=>changeInput(e, setOrderNumber)} 
                              value={orderNumber}
                              required
                />
              </Form.Group>
              <Form.Group controlId="customerNameInput">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control type="text" 
                              onChange={e=>changeInput(e, setCustomerName)} 
                              value={customerName}
                              required
                />
              </Form.Group>
              <Form.Group controlId="customerEmailInput">
                <Form.Label>Customer Email</Form.Label>
                <Form.Control type="email" 
                              onChange={e=>changeInput(e, setCustomerEmail)} 
                              value={customerEmail}
                              required
                />
              </Form.Group>
              <Form.Group controlId="customerPhoneInput">
                <Form.Label>Customer Phone</Form.Label>
                <Form.Control type="number" 
                              onChange={e=>changeInput(e, setCustomerPhone)} 
                              value={customerPhone}
                              required
                              min="0"
                />
              </Form.Group>
              <Form.Group controlId="partnerNameInput">
                <Form.Label>Destination</Form.Label>
                <Form.Control as="select" 
                              onChange={e=>changeDestination(e)} 
                              value={destination}
                              required
                >
                  <option value=""></option>
                  {props.profiles && props.profiles.filter( profile => {
                    return profile.name !== props.username 
                  }).map( profile => {
                    return (
                      <option key={profile.id} value={profile.name}>{profile.name}</option>
                    )
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="paymentMethod">
                <Form.Label>Payment</Form.Label>
                <Form.Control as="select" 
                              onChange={e=>setPaymentMethod(e.target.value)} 
                              value={paymentMethod}
                              required
                >
                  <option value="PREPAID">Prepaid</option>
                  <option value="PAYMENT PENDING">Payment Pending</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="boxesInput">
                <Form.Label>Number of Boxes</Form.Label>
                <Form.Control type="number" 
                              onChange={e=>changeInput(e, setBoxes)} 
                              value={boxes}
                              min="0"
                              required
                />
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Col xs="6">
                  <Form.Label>Item</Form.Label>
                    <Form.Control id="itemInput"
                                  type="text" 
                                  onKeyUp={e=> checkItemCode(e)}
                                  onChange={e=>changeInput(e, setItemInput)} 
                                  value={itemInput}
                    />
                  </Col>
                  <Col xs="2">
                  <Form.Label>Qty</Form.Label>
                    <Form.Control id="quantityInput"
                                  type="number"
                                  onChange={e=>changeInput(e, setQuantityInput)}
                                  value={quantityInput}
                    />
                  </Col>
                  <Col xs="2">
                  <Form.Label>Discount</Form.Label>
                    <Form.Control id="discountInput"
                                  type="number"
                                  onChange={e=>changeInput(e, setDiscountInput)}
                                  value={discountInput}
                    />
                  </Col>
                  <Col xs="auto">
                    <Form.Row>
                      <Form.Label style={{opacity:"0"}}>.</Form.Label>
                    </Form.Row>
                    <Form.Row>
                      <Button disabled={!matchedBarcode}
                              onClick={addItemToList}
                      >Add
                      </Button>
                    </Form.Row>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Table>
                  <thead>
                    <tr>
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
                        Total
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      return (
                        <tr key={product.barcode}>
                          <td>
                            {product.barcode}
                          </td>
                          <td>
                            {product.description }
                          </td>
                          <td>
                            {product.quantity}
                          </td>
                          <td>
                            {Math.round((parseFloat(product.price) * parseFloat(product.quantity))*100)/100 }
                          </td>
                          <td>
                          <FontAwesomeIcon icon='trash-alt' onClick={()=>{removeitem(product.barcode)}}/>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
              </Table>
              <Form.Group controlId="InvoiceDiscountInput">
                <Form.Label>Invoice Discount</Form.Label>
                <Form.Control type="number" 
                              onChange={e=>changeInput(e, setInvoiceDiscount)} 
                              value={invoiceDiscount}
                              required
                              min="0"
                />
              </Form.Group>
              <Button variant="primary" 
                      size="lg" 
                      block>
                <input className="btn btn-block btn-priamry" type="submit" value="Create Order" style={{color:"white"}}></input>
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
}

export default CreateInvoice;



