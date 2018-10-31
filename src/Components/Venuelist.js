import React, { Component } from 'react';
import ListItem from './Components/ListItem'

class Venuelist extends Component{
    render(){
        return (
            <ol className="Venuelist">
            <ListItem/>
            </ol>
        )
    }
}

export default Venuelist;