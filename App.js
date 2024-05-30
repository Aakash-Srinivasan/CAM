import { StyleSheet, Text, View, Image } from 'react-native';
import { Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import Button from './src/components/Button';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';

export default function App() {
  const [hasCameraPermission,setHasCameraPermission]=useState(null);
  const [image, setImage] =useState(null);
  const [type, SetType] =useEffect(Camera.Constants.Type.back);
  const [flash,setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef =useRef(null);

  useEffect(()=>{
    (async ()=>{
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus =await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  },[])

  const takePicture =async () => {
    if(cameraRef){
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      }catch(e){
        console.log(e);
      }
    }
  }
 
  const saveImage =async () =>{
    if(image){
      try{
        await MediaLibrary.createAssetAsnc(image);
        alert('Picture save 💥💥')
        setImage(null);
      } catch(e){
        console.log(e)
      }
    }

  }  
  
  
  if(hasCameraPermission == false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
    {!image ?
    <Camera
     style={styles.camera}
     type={type}
     flashMode={flash}
     ref={cameraRef}
     >
     <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      padding:30,
     }}>
     <Button icon={'retweet'} onPress={()=>{
      SetType(type === CameraType.back? CameraType.front: CameraType.back)
     }}/>
     <Button icon={'flash'} 
     color={flash === Camera.Constants.FlashMode.off ? 'gray':'#f1f1f1'}
     onPress={()=>{
      setFlash(flash === Camera.Constants.FlashMode.off
      ?Camera.Constants.FlashMode.onPress
      :Camera.Constants.FlashMode.off
      )
     }}/>
     </View>
     </Camera>
     :
     
     <Image source={{uri:image}} style={styles.camera}/>
    }
     <View>
     {image ?
     <View style={{
     flexDirection:'row',
     justifyContent:'space-between',
     paddingHorizontal:50
     }}>
      <Button title={"Re-Take"} icon="retweet" onPress={()=> setImage(null)}/>
      <Button title={"Save"} icon="check" onPress={saveImage}/>
     </View>
     :
     <Button title={'Take a Picture'} icon="camera" onPress={takePicture}/>
     }
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera:{
    flex:1,
    borderRadius:20
  }
});
