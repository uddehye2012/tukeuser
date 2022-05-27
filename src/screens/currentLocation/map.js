import {StyleSheet, Text, TouchableOpacity, View,SafeAreaView} from 'react-native';
import React,{useState,useRef,useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {fs, h, height, w} from '../../config';
import CustomHeader from '../../components/CustomHeader';
import MapViewDirections from 'react-native-maps-directions';
import { colors, } from '../../constants';
import { useSelector } from 'react-redux';


const Map = ({navigation}) => {
  const [mapLocation, setmapLocation] = useState({
    pickupcords: {
      latitude: 12.971940,
      longitude: 77.532745,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    droplocationcords: {
      latitude: 22.7377,
      longitude: 75.8788,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
  });

  // useEffect(() => {
  //   setmapLocation({
  //     pickupcords: {
  //       latitude : currentLocationLatitude,
  //       longitude : currentLocationLongitude,
  //       latitudeDelta: 0.015,
  //       longitudeDelta: 0.0121,
  //     },
  //     droplocationcords: {
  //       latitude: destinationLocationLatitue,
  //       longitude: destinationLocationLongitude,
  //       latitudeDelta: 0.015,
  //       longitudeDelta: 0.0121,
  //     },
  //   })
  // }, [])
  

  const currentLocationLatitude = useSelector(state=>  state.locationReducer.data.latitude)
  const currentLocationLongitude = useSelector(state=>  state.locationReducer.data.longitude)
  
  const destinationLocationLatitue = useSelector(state=> state.destinationLocationReducer.data.latitude)
  const destinationLocationLongitude = useSelector(state=> state.destinationLocationReducer.data.longitude)

  const mapRef = useRef();
  const {pickupcords, droplocationcords} = mapLocation;
  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader onPress={() => navigation.goBack()} text="Confirmation" />
      <View style={{height:h(70)}}>
      <MapView
      // provider='AIzaSyBzhsIqqHLkDrRiSqt94pxHJCdHHXgA464' // remove if not using Google Maps
      ref={mapRef}
       style={styles.map}
      region={pickupcords}>
      <Marker coordinate={pickupcords}  />
      {/* <Marker coordinate={droplocationcords}   /> */}
      <MapViewDirections
        origin={pickupcords}
         destination={droplocationcords}
        apikey={'AIzaSyBzhsIqqHLkDrRiSqt94pxHJCdHHXgA464'}
       
         strokeWidth={7}
         strokeColor={'blue'}
        optimizeWaypoints={true}
        onReady={result => {
          mapRef.current.fitToCoordinates(result.coordinate, {
            edgePadding: {
              right: 530,
              bottom: 300,
              left: 530,
              top: 500,
            },
          });
        }}
      />
    </MapView>
    </View>
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
          marginVertical: w(8),
          alignItems: 'center',
        }}>
        <Text style={{fontSize: fs(16)}}>Location a suitable vehicle ...</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: 'black', fontSize: fs(17), fontWeight: '600'}}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '95%',
    marginTop: h(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
