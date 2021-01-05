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
                    <h3>Order Number :</h3> <b>{ this.props.invoice.order }</b>
                </li>
                <li>
                    <h3>Customer Name : </h3> <b>{ this.props.invoice.name }</b>
                </li>
                <li>
                    <h3>Customer Number : </h3><b>{ this.props.invoice.number }</b>
                </li>
                <li>
                    <h3>Number of Boxes : </h3><b>{ this.props.invoice.boxes }</b>
                </li>
                <li>
                    <h3>Payment Method : </h3><b>{ this.props.invoice.method }</b>
                </li>
                <li>
                    <h3>COD Amount : </h3><b>{ this.props.method === "PREPAID" || "prepaid" ? "0" : this.props.invoice.amount }</b>
                </li>
            </ul> 
            <span style={{float:"right"}}><b>BOX _____ of { this.props.boxes }</b></span>
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
