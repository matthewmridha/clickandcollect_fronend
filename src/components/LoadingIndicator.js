import React from 'react'
import Loader from 'react-loader-spinner';
import { usePromiseTracker } from "react-promise-tracker";


const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && 
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                zIndex: "100000000000"
            }}
        >
            <Loader type="ThreeDots" color="#0082C3" height="100" width="100" />
        </div>
    );  
   }

export default LoadingIndicator