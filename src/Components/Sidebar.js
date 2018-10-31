import React, { Component } from 'react';
import Venuelist from './Components/Venuelist'

class Sidebar extends Component{
    render(){
        return (
            <div className="Sidebar">
                <Venuelist/>
            </div>
        )
    }
}

export default Sidebar;