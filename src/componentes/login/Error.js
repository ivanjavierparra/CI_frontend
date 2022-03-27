import React from 'react'

export default function Error({error}) {
    return (
        <div style={{color:"red"}}>
            {error}
        </div>
    )
}
