import React, { Component } from 'react';

import './App.css';

import axios from 'axios';


class App extends Component {

  //setting state for venues and markers for app component
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
  // Get the FourSquare data
  getVenues = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      //foursquare client id 
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
      //if for some reason api doesn't work handling error with console.log and alert 
      console.log("error " + error);
      alert("Sorry, That didn't work. Check console for more details"); 
   })
  }
 
  


//constructor function will a new map
initMap = () => {

  // display google map
  let map = new window.google.maps.Map(document.getElementById("map"), {
    //set Latitude and longitude
    center: { lat: 33.7, lng: -117.7675 },
    //setting zoom level for map
    zoom: 10
  });

  //initializing map
  this.map = map;

  //create an infowindow(https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple)
  let infowindow = new window.google.maps.InfoWindow();
  
  const allMarkers = [];
  //setting state of map and infowindow
  this.setState({
    map: map,
    infowindow: infowindow
  });

  //for each value do the following(create markers with name, city and location)
  this.state.venues.forEach(myvenue => {
    //getting value for name, city and location and storing that in contentString variable
    let contentString = `${myvenue.venue.name +
      ", " +
      myvenue.venue.location.city + ", "+ myvenue.venue.location.address}`;
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
      address: myvenue.venue.location.address,
      myvenue: myvenue,      
      id: myvenue.venue.id,
      name: myvenue.venue.name,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: myvenue.venue.name
    });

    //setting event listener for marker
    marker.addListener("click", function() {
      //adding animation to markers
      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      }
      //Wait 1500 milliseconds, and then set animation to null
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);

      //change content before opening infowindow and set that to contentString which has information about name city and address
      infowindow.setContent(contentString);

      //this function will be called to open infowindow
      infowindow.open(map, marker);
    });
    //push marker
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
}


listItemClick = (venues) => {
  //This will check if the marker id match the venue id 
  let marker = this.state.markers.filter(m => m.id === venues.id)[0];

//adding city and address on click of list item
  this.state.infowindow.setContent(`${marker.name +
    ", " +
  marker.city + ", " + marker.address}`);

  //set the map positon to marker positon
  this.map.setCenter(marker.position);
  //open infowindow
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

//filtering venues to match the query 
filtermyvenue(query) {
  let f = this.state.venues.filter(myvenue => myvenue.venue.name.toLowerCase().includes(query.toLowerCase()))
  console.log(this.state);
  //show the infowindow 
  this.state.markers.forEach(marker => {
    //console.log(marker);
    //if marker matches the query set marker visibility true else false
    marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
    marker.setVisible(true) :
    marker.setVisible(false);
  });
  //when there is no result found in query close the infowindow
  if (f.length === 0) {
    //this will close the infowindow  
    this.state.infowindow.close();   
  }
  //Set the state to reflect the query
  this.setState({filtermyvenue: f, query}); 
}

  render() {
    return (  
      <main>
        {/*Here I'm adding map and role and aria label as per the accesibility standard*/}      
      <div role="application" aria-label="map" id='map'></div>
      {/*Here I'm adding sidebar, aria label as per the accesibility standard*/}
      <div aria-label="sidebar" id='sidebar'>
      {/*adding header*/}
      <div className="header">Coffee Places - Orange County, CA</div>
      {/*adding serch input field and setting autoFocus="autofocus"*/}
      <input type="text" autoFocus="autofocus" tabIndex="0" className="SearchVenues" placeholder="Search venues" value={this.state.query} onChange={(e)=>{this.filtermyvenue(e.target.value)}}/>
      <br/>
      <br/>
      {
        this.state.filtermyvenue && this.state.filtermyvenue.length > 0 && this.state.filtermyvenue.map((myvenue, index) => (
            <div tabIndex="-1" key={index} className="venue-item">
                {/* <h4>{myvenue.venue.name}</h4> */}
                <button onClick={()=>{this.listItemClick(myvenue.venue)}}>{myvenue.venue.name}</button>
            </div>
        ))
      }
      </div>
      </main>      
    )
  }
}

function loadScript(source) {
  try {
    //adding try catch block to make sure if script doesnt work it gives proper console and alert
    //select script tag
    var index = window.document.getElementsByTagName('script')[0]
    var script = window.document.createElement('script')
    script.src = source
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
   } catch (error) {
    console.log(error);
    //alert for user if it doesnt work
   alert("Sorry, That didn't work. Check console for more details");
   }
  }

export default App;
