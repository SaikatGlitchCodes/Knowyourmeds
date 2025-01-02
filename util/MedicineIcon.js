import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const iconRef = (item, size=24, color='#3b82f6')=>{
  
    switch (item) {
      case 'Injection':
        return <Fontisto name="injection-syringe" size={size} color={color} />
      case 'Capsule':
        return <FontAwesome5 name="capsules" size={size} color={color} />
      case 'Pills':
        return <Fontisto name="pill" size={size} color={color} />
      case 'Tablet':
        return <FontAwesome5 name="tablets" size={size} color={color} />
      default:
        return <Fontisto name="injection-syringe" size={size} color={color} />;
    }
  }
export default iconRef;  