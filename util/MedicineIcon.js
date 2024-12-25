import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const iconRef = (item, size)=>{
    switch (item.type) {
      case 'Injection':
        return <Fontisto name="injection-syringe" size={size || 24} color={'#3b82f6'} />
      case 'Capsules':
        return <FontAwesome5 name="capsules" size={size || 24} color={'#3b82f6'} />
      case 'Pills':
        return <Fontisto name="pill" size={size || 24} color={'#3b82f6'} />
      case 'Tablet':
        return <FontAwesome5 name="tablets" size={size || 24} color={'#3b82f6'} />
      default:
        return '';
    }
  }
export default iconRef;  