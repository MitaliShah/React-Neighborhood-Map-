import React, { Component } from 'react';

import './App.css';

import axios from 'axios';
import Sidebar from './Components/Sidebar'

class App extends Component {

  //setting state for venues
  state ={
    venues: []
  }

  //when the react component monunts, it will call loadMap function
  componentDidMount(){
    this.getVenues()

  }

  loadMap = () => {
    //this will load the script
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyASw2o-e_7SpPHJvp1qz1_PmsGtxrBm0QE&callback=initMap');
    //accesing initmap using window object
    window.initMap = this.initMap;

  }

  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: 'WP4D0PD3WJMXZ4DFL2IMTINMQMPTNH0R0O2IWLAP3XPZW5MI',
      client_secret: 'AJWM0UDFEKRYWNL1PZE1HSGAPEESZODBURSGES25MQQ413KA',
      query: 'coffee',
      limit: 100,
      near: 'orange county, CA',
      v: '20182507'
    }

    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
     this.setState({
      venues: response.data.response.groups[0].items 
    },this.loadMap())
  })
    .catch(error => {
      console.log("error " + error)    
   })
  }
 
  


//constructor function creates a new map
initMap = ()  => {  

      // display google map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.7000, lng: -117.7675},
        zoom: 10
      })

      //create an infowindow(https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple)
      const infowindow = new window.google.maps.InfoWindow();

      //for each value do the following(create markers)
      this.state.venues.map(myvenue =>{

      const contentString = `${myvenue.venue.name}`
      //loop over state  

      //create a marker
      //from https://developers.google.com/maps/documentation/javascript/markers
      const marker = new window.google.maps.Marker({
      position: {lat: myvenue.venue.location.lat, lng: myvenue.venue.location.lng},
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: myvenue.venue.name 
    })

    //on clicking marker adding click event listener
    marker.addListener('click', function() {

      //change content before opening infowindow
      infowindow.setContent(contentString);

      //this function will be called to open infowindow 
      infowindow.open(map, marker);
    });

    })
  }



  render() {
    return (  
      <main>
      <Sidebar/>
      <div id='map'></div>
      </main>      
    )
  }
}

function loadScript(source) {
  //select script tag
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = source
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  }

export default App;
