import React, { Component } from 'react';

import './App.css';

import axios from 'axios';


class App extends Component {

  //setting state for venues
  state ={
    venues: [],
    markers: []
  }

  //when the react component monunts, it will call loadMap function
  componentDidMount(){
    window.gm_authFailure = () => {
      alert('ERROR!! \nFailed to get Google map.')
      console.log('ERROR!! \nFailed to get Google map.')
   }
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
initMap = () => {

  // display google map
  let map = new window.google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.7, lng: -117.7675 },
    zoom: 10
  });

  //initializing map
  this.map = map;

  //create an infowindow(https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple)
  let infowindow = new window.google.maps.InfoWindow();

  const allMarkers = [];
  this.setState({
    map: map,
    infowindow: infowindow
  });
  //for each value do the following(create markers)
  this.state.venues.map(myvenue => {
    let contentString = `${myvenue.venue.name +
      ", " +
      myvenue.venue.location.city}`;
    //loop over state

    //create a marker
    //from https://developers.google.com/maps/documentation/javascript/markers
    let marker = new window.google.maps.Marker({
      position: { 
        lat: myvenue.venue.location.lat,
        lng: myvenue.venue.location.lng
      },
      map: map,
      city:myvenue.venue.location.city,
      myvenue: myvenue,      
      id: myvenue.venue.id,
      name: myvenue.venue.name,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: myvenue.venue.name
    });

    // //on clicking marker adding click event listener
    // marker.addListener("click", function() {

    //   //change content before opening infowindow
    //   infowindow.setContent(contentString);

    //   //this function will be called to open infowindow
    //   infowindow.open(map, marker);
    // });
    marker.addListener("click", function() {
      //adding animation to markers
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      }
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);

      // window.google.maps.event.addListener(marker, "click", () => {
      //   this.state.infowindow.setContent(marker.name);
      //   this.state.map.setContent(marker.position);
      //   this.state.infowindow.open(this.state.map, marker);
      // });

      //change content before opening infowindow
      infowindow.setContent(contentString);

      //this function will be called to open infowindow
      infowindow.open(map, marker);
    });

    allMarkers.push(marker);
  });
  this.setState({
    markers: allMarkers
  });
  this.setState({ filtermyvenue: this.state.venues });
};

constructor(props) {
  super(props);
  this.state = {
    query: ""
  };
  // this.listItemClick = this.listItemClick.bind(this);
}



listItemClick = (venues) => {
  let marker = this.state.markers.filter(m => m.id === venues.id)[0];
        // this.state.infowindow.setContent(marker.name);

        this.state.infowindow.setContent(`${marker.name +
          ", " +
          marker.city}`);//adding city on click of list item      

        this.map.setCenter(marker.position);
        this.state.infowindow.open(this.state.map, marker);
        console.log(marker);
        //adding animation to markers
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      }
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);
}

//filtering venues
filtermyvenue(query) {
  let f = this.state.venues.filter(myvenue => myvenue.venue.name.toLowerCase().includes(query.toLowerCase()))
  console.log(this.state);
  this.state.markers.forEach(marker => {
    //console.log(marker);
    marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
    marker.setVisible(true) :
    marker.setVisible(false);
  });
  this.setState({filtermyvenue: f, query}); 
}




  render() {
    return (  
      <main>
      <div role="application" aria-label="map" id='map'></div>
      <div aria-label="sidebar" id='sidebar'>
      <input placeholder="Search venues"value={this.state.query} onChange={(e)=>{this.filtermyvenue(e.target.value)}}/>
      <br/>
      <br/>
      {
        this.state.filtermyvenue && this.state.filtermyvenue.length > 0 && this.state.filtermyvenue.map((myvenue, index) => (
          <div key={index} className="venue-item" onClick={()=>{this.listItemClick(myvenue.venue)}}>
          <h4>{myvenue.venue.name}</h4>
            </div>        
        ))
      }
      </div>
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
