import React, {useState, useEffect, useContext} from 'react'
import { Table, Button } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { trackPromise } from 'react-promise-tracker';
import { URLContext } from '..';

function StockOutList( props ){
  	const [authToken] = useCookies(["auth-token"])
  	const token = authToken["auth-token"]
	const [stockOut, setStockOut] = useState([])
	const APIURL = useContext(URLContext)
	
	useEffect(()=>{
    	getStockData()
	},[]);
    
  	const getStockData = () => {
    	fetch(`${APIURL.URL}/stock_out/`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
                "Authorization" : `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(res => setStockOut(res))
        .catch(error => console.log(error))
	}

  	const stockReceived = (id) => {
    	trackPromise(
      		fetch(`${APIURL.URL}/stock_returned/return_product/`,{
				method : "POST",
				headers : {
					"Content-Type" : "application/json",
					'Accept': 'application/json',
					"Authorization" : `Token ${token}`
				},
				body : JSON.stringify({
				productId : id,
          		})
      		})
			.then((res)=>{
				if (res.status === 200){
					getStockData()
				}
      		})
    	)
	  }
	  
  	return(
        <div>
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
						QTY
					</th>
					<th>
						Location
					</th>
              	</tr>
            	</thead>
            	<tbody>
					{stockOut.filter((stock)=>{return stock.status === "PENDING"}).map(item => {
            			return(
							<tr key={item.id}>
								<td>
									{item.item}
								</td>
								<td>
									{item.description}
								</td>
								<td>
									{item.quantity}
								</td>
								<td>
									{item.profile}
								</td> 
								{props.isHost ? 
									<td>
										<Button onClick={()=>stockReceived(item.id)}>
											Received
										</Button>
									</td> 
								: null}
							</tr>
            			)
          			})}
          		</tbody>
          	</Table>
        </div>
    )
}

export default StockOutList