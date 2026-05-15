import React from 'react'
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title }) => {
    return (
        // const pageTitle = typeof title === 'string' ? title : "Welcome";

       <>
            <title>{`${title} - ShopIT`}</title>
       </>
       

    )
}

export default MetaData;
