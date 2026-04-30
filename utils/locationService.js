import * as Location from 'expo-location';

// Coordenadas da FIAP Paulista
const FIAP_COORDS = {
  latitude: -23.5632,
  longitude: -46.6527,
};

const RADIUS_METERS = 500;

// Solicita permissão de localização
export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

// Obtém localização atual do usuário
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    throw new Error('Não foi possível obter sua localização');
  }
};

// Calcula distância entre dois pontos em metros (fórmula de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Valida se está dentro do raio da FIAP
export const validateLocation = async () => {
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    throw new Error('Permissão de localização negada');
  }

  const userLocation = await getCurrentLocation();
  
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    FIAP_COORDS.latitude,
    FIAP_COORDS.longitude
  );

  const isValid = distance <= RADIUS_METERS;
  
  return {
    isValid,
    distance: Math.round(distance),
    userLocation,
  };
};
