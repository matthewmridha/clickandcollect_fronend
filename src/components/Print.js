import React from 'react'
import { propTypes } from 'react-bootstrap/esm/Image';
import { Modal, Button } from 'react-bootstrap'
///import  ComponentToPrint  from './ComponentToPrint';
import  Example  from './ReactPrint';


function Print( props ) {
    return (
      <>
        <Modal
          {...props}
          backdrop="static"
          keyboard={false}
          
        >
        <Modal.Body>
        < Example invoice={props.invoice}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={ props.close }>
              Cancel
            </Button>
           
        </Modal.Footer>
        </Modal>
      </>
    );
}
/*
import React from "react";
import ReactToPrint from "react-to-print";
import PropTypes from "prop-types";

class ComponentToPrint extends React.Component {
  render( props ) {
    return (
      <div className='print-source'>
        <table>
          <thead>
            <tr>
              <th>column 1</th>
              <th>column 2</th>
              <th>column 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>data 3</td>
            </tr>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>data 3</td>
            </tr>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>data 3</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Print extends React.Component {
  render( props ) {
    return (
      <div>
        <ReactToPrint
          trigger={() => <a href="#">Print this out!</a>}
          content={() => this.componentRef}
        />
        <ComponentToPrint ref={el => (this.componentRef = el)} />
      </div>
    );
  }
}
*/
export default Print;
