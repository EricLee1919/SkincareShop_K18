import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "700px",
};

const center = {
  lat: 10.84217,
  lng: 106.82811,
};

const position = {
  lat: 10.84217,
  lng: 106.82811,
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [{ saturation: 50 }, { lightness: 20 }],
  },
];

const onLoad = (infoWindow) => {
  console.log("infoWindow: ", infoWindow);
};

export default function GoogleMapsComponent() {
  return (
    <LoadScript>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{ styles: mapStyles }}
      >
        <Marker position={position} />
        <InfoWindow onLoad={onLoad} position={position}>
          <Box>
            <Typography variant="h6">RRQM+9M2, Long Thạnh Mỹ</Typography>
            <Typography variant="body2">
              Quận 9, Hồ Chí Minh 70000, Vietnam
            </Typography>
          </Box>
        </InfoWindow>
      </GoogleMap>
    </LoadScript>
  );
}
