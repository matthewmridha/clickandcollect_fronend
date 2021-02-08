import React, {useState, useEffect, useContext} from 'react';
import { faCheckSquare, faFilter, faSignOutAlt, faSearch, faTrashAlt, faPrint, faSortNumericDown, faSortNumericUp, faSort } from '@fortawesome/free-solid-svg-icons'
import InvoiceList from './InvoiceList';
import StockOutList from './StockOutList';
import InvoiceDetails from './InvoiceDetails'
import Commissions from './Commissions';
import Sales from './Sales';
import { Button, Accordion, Card } from "react-bootstrap";
import CreateInvoice from './CreateInvoice';
import LoadingIndicator from "./LoadingIndicator"
import { trackPromise } from 'react-promise-tracker';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCookies } from 'react-cookie'
import { URLContext } from '..'

library.add( faCheckSquare, faFilter, faSignOutAlt, faSearch, faTrashAlt, faPrint, faSortNumericDown, faSortNumericUp, faSort )

function Dashboard ( props ) {
    const [ invoices, setInvoice ] = useState( [] );
    const [ selectedInvoice, setSelectedInvoice ] = useState( null );
	const [ invoiceToEdit, setInvoiceToEdit ] = useState( null )
	const [ createInvoiceModalShow, setCreateInvoiceModalShow ] = useState( false );
	const [ detailInvoiceModalShow, setDetailInvoiceModalShow ] = useState( false );
	const [ destinationFilter, setDestinationFilter ] = useState( [] );
	const [ items, setItems ] = useState( [] );
	const [ profiles, setProfiles ] = useState( [] );
	const [ username ] = useCookies( ["username"] );
	const [ products, setProducts ] = useState( [] );
	const APIURL = useContext( URLContext )
	
	useEffect( () => {
		getDashBoardData()
	}, [] );

	useEffect( () => {
		fetchProfiles()
	}, [] );

	const getDashBoardData = () => {
        trackPromise(
          fetch( 
			`${APIURL.URL}/dashboard/`, {
            method : "GET",
            headers : {
              "Content-Type" : "application/json",
              "Accept": "application/json",
              "Authorization" : `Token ${props.token}` 
            }
          })
          .then( res => res.json() )
		  .then( res => setInvoice(res) )
		  .catch( error => alert(error) )
        )
	}
	
	const getProducts = ( invoice ) => {
		setProducts( null )
        fetch( `${ APIURL.URL }/products/${ invoice.order_number }/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
                "Authorization" : `Token ${ props.token }`
            },
        })
		.then( ( res ) => res.json() )
		.then( res => setProducts( res ) )
	}
    
	const invoiceClicked = invoice => {
		setSelectedInvoice( invoice )
		getProducts( invoice )
		setDetailInvoiceModalShow( true )
	}

	const updateData = () => {
		getDashBoardData();
		getProducts( selectedInvoice )
		
	}

	const openCreateInvoice = () => {
        getItemProfileData();
        setCreateInvoiceModalShow( true );
	}

	const getItemProfileData = () =>{
		fetch( `${ APIURL.URL }/invoice/`,{
            method : "GET",
            headers : {
              "Content-Type" : "application/json",
              'Accept': 'application/json',
              "Authorization" : `Token ${ props.token }`
            }
        })
        .then( res => res.json() )
        .then( res => {
          setItems( res.Item )
          setProfiles( res.Profile )
        })
	}

	const fetchProfiles = () => {
		fetch( 
			`${APIURL.URL}/profileList/`, {
			method : "GET",
			headers : {
			  "Content-Type" : "application/json",
			  "Accept": "application/json",
			  "Authorization" : `Token ${ props.token }` 
			}
		})
		.then( res => res.json() )
		.then( res => {
			let names = [];
			for( let i = 0; i < res.length; i++ ) {
				names.push( res[i]["name"])
			}
			setDestinationFilter( names )
		})
		.catch( error => alert( error ) )
        
	}
	return(
        <div className="App">
			<header className="App-header" >
				<div style={{display:"flex", flexDirection:"column", justifyContent:"start", width:"100%", alignItems:"center"}}>
					<img style={{ width:"150px", height: "auto", maxWidth: "70vw"}} src="https://www.decathlon.com.bd/pub/media/logomobile/default/deca_logo.jpg"/>
					<h3>
						<b>Click & Collect</b>
					</h3>
					<div style={{display:"flex",flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
						<div>{username["username"]}</div>
						<div><FontAwesomeIcon onClick={props.logout} icon="sign-out-alt"/></div>
					</div>
				</div>
			</header>
			<main>
				<div 
					className='container' 
					style={{ 
						width:"100vw", 
						display:"flex", 
						justifyContent:"stretch", 
						flexDirection:"column", 
						alignItems:"center"
					}}
				>
					<LoadingIndicator />
					{selectedInvoice ? 
						<InvoiceDetails 
							show = { detailInvoiceModalShow }
							onHide = { () => setDetailInvoiceModalShow( false ) }
							close = { () => setDetailInvoiceModalShow( false ) }
							invoice = { selectedInvoice } 
							products = { products }
							items = { items }
							profiles = { profiles }
							update = { updateData }
							isHost = { props.isHost }
							username = { username["username"] }
							data = { getItemProfileData }
						/>
					: null }
					
					<CreateInvoice  
						show = { createInvoiceModalShow }
						onHide = { () => setCreateInvoiceModalShow( false ) }
						items = { items }
						profiles = { profiles }
						update = { getDashBoardData }
						username = { username["username"] }
					/>                
					<Accordion style={{ width:"90vw" }}>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="0">
							Orders
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="0">
								<Card.Body>
								<InvoiceList 	invoices={invoices} 
												invoiceClicked={invoiceClicked}
												isHost={props.isHost}
												destinationFilter = { destinationFilter }
												username = { username["username"] }
								/>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="1">
								Products
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="1">
								<Card.Body>
									<StockOutList isHost={props.isHost} />
								</Card.Body>
							</Accordion.Collapse>
						</Card>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="2">
								Sales
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="2">
								<Card.Body>
									<Sales isHost={props.isHost} />
								</Card.Body>
							</Accordion.Collapse>
						</Card>
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="3">
								Commissions
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="3">
								<Card.Body>
									<Commissions isHost={props.isHost} />
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
					{ props.isHost === true ? 
					<div>
						<Button size="lg"
								block onClick={openCreateInvoice}
								style={{ backgroundColor: "#0082C3", marginTop : "10px" }}
								>Create Invoice
						</Button>{" "}
					</div>
					: null }
				</div>
			</main>
    	</div>
    )
}
export default Dashboard