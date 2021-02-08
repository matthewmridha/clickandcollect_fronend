import React from "react";
import ReactToPrint from "react-to-print";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ComponentToPrint extends React.Component {
  render() {
    return(
        <div className="PrintList" style={{ color : "#0082C3" }}>
            <ul>
                <li>
                <img style={{ display:"block", marginLeft: "auto", marginRight: "auto", width:"500px", height: "auto", maxWidth: "70vw"}} src="https://www.decathlon.com.bd/pub/media/logomobile/default/deca_logo.jpg"/>
                </li>
                <li>
                    <hr></hr>
                </li>
                <li>
                    <b>Order Number : </b>  { this.props.invoice.order }
                </li>
                <li>
                    <b>Customer Name : </b> { this.props.invoice.name }
                </li>
                <li>
                    <b>Number of Boxes : </b>{ this.props.invoice.boxes }
                </li>
                <li>
                    <b>Payment Method : </b>{ this.props.invoice.method }
                </li>
                <li>
                    <b>COD Amount : </b>{ this.props.invoice.method === "PREPAID" ? "0" : this.props.invoice.amount }
                </li>
                <li>
                    <b>Pick Up Point : </b>{ this.props.invoice.collection_point }
                </li>
            </ul> 
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><h1 style={{ display:"block", marginLeft: "auto", marginRight: "auto" }}>www.decathlon.com.bd</h1></div>
            <div><span style={{ float:"right" }}><b>BOX _____ of { this.props.invoice.boxes }</b></span></div>
            
        </div>
    )
  }
}

class Example extends React.Component {
    render() {
    return (
      <div>
        <ComponentToPrint invoice={this.props.invoice} ref={el => (this.componentRef = el) } />
        <ReactToPrint
            content={ () => this.componentRef }
            trigger={ () => <button class="btn btn-primary"><FontAwesomeIcon icon="print"/></button> }
        />
        
      </div>
    );
  }
}

export default Example;
