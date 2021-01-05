import React, { useState } from 'react'
import { propTypes } from 'react-bootstrap/esm/Image';
import { Modal, Button } from 'react-bootstrap'


function Confirm( props ) {
    return (
      <>
        <Modal
          {...props}
          backdrop="static"
          keyboard={false}
        >
         <Modal.Body>
            { props.message }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={ props.close }>
              Cancel
            </Button>
            <Button variant="primary" onClick={ () => props.passedFunction( props.argument ) }>Yes</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Confirm;