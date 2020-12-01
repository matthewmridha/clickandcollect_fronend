import React from 'react';
import { Alert } from 'react-bootstrap'

function AlertDismissible(props) {
    return (
        <Alert style={{position:"absolute", zIndex:"1000000", marginLeft:"auto", marginRight:"auto"}} variant="danger" onClose={() => props.closeAlert()} dismissible>
          <Alert.Heading>{props.alertHeader}</Alert.Heading>
          <p>
            {props.alertMessage}
          </p>
        </Alert>
      );
    
    
  }

export default AlertDismissible