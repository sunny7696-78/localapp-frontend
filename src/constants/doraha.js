// src/constants/doraha.js
// LocalApp sirf Doraha (Ludhiana district, Punjab) ke liye hai.
// Yeh file SAARI pages mein shared hai — area list yahan se hi aati hai,
// taaki Ludhiana city ke areas (Model Town, Civil Lines, etc.) kabhi na dikhein.

// Doraha town ke andar ke localities — customer/vendor/driver yeh select karte hain
export const DORAHA_LOCALITIES = [
  'Doraha Mandi',
  'Doraha Bus Stand',
  'Doraha Grain Market',
  'Doraha Civil Hospital',
  'School Road, Doraha',
  'SBS Nagar, Doraha',
  'GT Road, Doraha',
  'Railway Station Road, Doraha',
];

// Doraha tehsil ke nearby villages — yeh delivery/ride ke liye outer area maane jayenge
export const DORAHA_NEARBY_VILLAGES = [
  'Jaipura',
  'Rampur',
  'Malhipur',
  'Begowal',
  'Rajgarh',
  'Sidhwan Bet',
  'Sahnewal',
  'Mullanpur Dakha',
];

// Dropdown ke liye full list (localities + nearby villages + Other)
export const ALL_DORAHA_AREAS = [...DORAHA_LOCALITIES, ...DORAHA_NEARBY_VILLAGES, 'Other'];

// Ride ke liye popular destinations (Doraha se aane-jaane wale)
export const RIDE_DESTINATIONS = [
  'Doraha Mandi',
  'Doraha Bus Stand',
  'Doraha Railway Station',
  'Khanna',
  'Samrala',
  'Sahnewal',
  'Payal',
  'Ludhiana City', // bahar jaane ke liye ek hi outer option, area nahi
];

export const APP_CITY = 'Doraha';
export const APP_DISTRICT = 'Ludhiana';
export const APP_STATE = 'Punjab';
export const APP_PINCODE = '141421';
export const APP_FULL_LOCATION = 'Doraha, Ludhiana, Punjab';