import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {colors, images} from '../../constants';
import CommonInputField from '../../components/CommonInputField';
import {h, regx, w} from '../../config';
import CommonBtn from '../../components/CommonBtn';
import CustomHeader from '../../components/CustomHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MOBILE_NUMBER} from '../../redux/constants/type';
import {signin} from '../../redux/actions/signIn';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AuthContext} from '../../utils/context';
import {useDispatch} from 'react-redux';
import {loader} from '../../redux/actions/loader';
import {_checkInternet} from '../../utils/internet';
import NoInternet from '../../components/NoInternet';

const LoginWithPassword = ({navigation}) => {
  const [number, setnumber] = useState('');
  const [password, setpassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isNet, setIsNet] = useState(true);

  const {signIn} = useContext(AuthContext);

  const dispatch = useDispatch();

  const onConfirmHandler = async () => {
    // signIn('0000')
    if (!password || !number) {
      setIsError(true);
    } else {
      const net = await _checkInternet();
      if (net) {
        setIsNet(true);
        dispatch(loader(true));
        setIsError(false);
        axios
          .post('http://192.168.0.178:5001/api/Login/DriverLogin', {
            password: password,
            mobile_No: number,
          })
          .then(async function (response) {
            console.log('resonse===>>', response);
            dispatch(loader(false));
            if (response.status == 200) {
              dispatch(loader(false));
              signIn(response);
            }
            // const Token = response.data.token;
            // console.log('Token', Token);
            // navigation.navigate('VehicleScreen');
            try {
              await EncryptedStorage.setItem('user_session', Token);

              // Congrats! You've just stored your first value!
            } catch (error) {
              // There was an error on the native side
            }
          })
          .catch(function (error) {
            alert('please enter valid credientails');
            dispatch(loader(false));
          });
        dispatch({type: MOBILE_NUMBER, moblieNumber: number});
      } else {
        setIsNet(false);
        Alert.alert('Oops! Check your Internet Connection');
      }
    }
  };

  return (
    <>
    {isNet  ?
    <View style={styles.container}>
      <CustomHeader onPress={() => navigation.goBack()} />
      <View style={{marginTop: 40}}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Enter your number</Text>
        </View>
        <CommonInputField
          placeholder="Enter your phone number"
          value={number}
          onChangeText={data => setnumber(data)}
          maxLength={10}
          keyboardType={'numeric'}
          warningTitle={
            !number
              ? `Mobile Number is required`
              : `Please enter your valid mobile number!`
          }
          warning={
            !number ? isError : number && !regx.phoneLastTen.test(number)
          }
        />
        <View style={{marginTop: 22}}>
          <CommonInputField
            placeholder="Enter your password"
            value={password}
            onChangeText={data => setpassword(data)}
            maxLength={10}
            secureTextEntry={true}
            warningTitle={!password ? `Password is required.` : ``}
            warning={!password ? isError : password}
          />
        </View>
      </View>

      <View style={{marginTop: 48}}>
        <CommonBtn
          text="Confirm"
          onPress={onConfirmHandler}
          customBtnStyle={{
            padding: 11,
            width: 355,
            backgroundColor: colors.hex_f56725,
          }}
        />
      </View>
      <View style={styles.confirmBtn}>
        <TouchableOpacity>
          <Text style={{fontSize: 16}}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{fontSize: 16}}>Forgot password</Text>
        </TouchableOpacity>
      </View>
    </View>
     : <NoInternet  /> }
    </>
  );
};

export default LoginWithPassword;

const styles = StyleSheet.create({
  appLogo: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 9,
  },
  container: {
    flex: 1,
    backgroundColor: '#E7E7E7',
  },
  headingView: {
    alignItems: 'center',
    marginTop: 28,
    fontSize: 19,
    marginBottom: 42,
  },
  confirmBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    alignSelf: 'center',
    marginTop: 15,
  },
  headingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#414042',
  },
});