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
          show={props.show} onHide={props.close}
          size="xl"
        >
        <Modal.Body>
        < Example invoice={props.invoice}/>
        </Modal.Body>
        </Modal>
      </>
    );
}

export default Print;
