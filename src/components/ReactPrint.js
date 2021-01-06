import React from "react";
import ReactToPrint from "react-to-print";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ComponentToPrint extends React.Component {
  render() {
    return(
        <div className="PrintList">
            <ul>
                <li>
                    <b>Order Number : </b>  { this.props.invoice.order }
                </li>
                <li>
                    <b>Customer Name : </b> { this.props.invoice.name }
                </li>
                <li>
                    <b>Customer Number : </b>{ this.props.invoice.phone }
                </li>
                <li>
                    <b>Number of Boxes : </b>{ this.props.invoice.boxes }
                </li>
                <li>
                    <b>Payment Method : </b>{ this.props.invoice.method }
                </li>
                <li>
                    <b>COD Amount : </b>{ this.props.invoice.method === "payment pending" ||  this.props.invoice.method === "PAYMENT PENDING" ? this.props.invoice.amount : "0" }
                </li>
            </ul> 
            <span style={{float:"right"}}><b>BOX _____ of { this.props.invoice.boxes }</b></span>
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
