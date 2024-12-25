import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const iconRef = (item, logoColor)=>{
    switch (item.type) {
      case 'Injection':
        return <Fontisto name="injection-syringe" size={24} color={logoColor} />
      case 'Capsules':
        return <FontAwesome5 name="capsules" size={24} color={logoColor} />
      case 'Pills':
        return <Fontisto name="pill" size={24} color={logoColor} />
      case 'Tablet':
        return <FontAwesome5 name="tablets" size={24} color={logoColor} />
      default:
        return '';
    }
  }
export default iconRef;  