import React, { Component } from "react";
import { Text, View, TouchableOpacity, Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class Camera extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    this.getPermission();
  }

  getPermission = async () => {
    if (Platform.OS != "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status != "granted") {
        Alert.alert("Sorry!! Access to camera roll is not granted");
      }
    }
  };

  uploadImage = (uri) => {
    const data = new FormData();
    var fileName = uri.split("/")[uri.split("/").length - 1];
    var type = "image/" + uri.split(".")[uri.split(".").length - 1];
    const fileToUpload = {
      uri: uri,
      name: fileName,
      type: type,
    };
    data.append("digit", fileToUpload);
    fetch("http://fdb10a118b01.ngrok.io/predict-alphabet", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => (
        response.json();
      ))
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  pickImage = async () => {
    try {
      var result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          image: result.data,
        });
        console.log(result.uri);
        this.uploadImage(result.uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{ margin: 50 }}
          onPress={() => {
            this.pickImage();
          }}
        >
          <Text>Click Me</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
