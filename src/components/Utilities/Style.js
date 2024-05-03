import React from 'react'

function Astrick(props) {
    return (  
        <span style={{'color':props.color,'fontSize':props.size}}>
            *
        </span>
    )
}
export {Astrick};

