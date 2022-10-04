import Image from './Image';
import {useSearchContext} from '../search/SearchContext';

export default function ImageColumn() {
  const images = useSearchContext().state.imageRegions;
  
  return (
    <div style={{'maxHeight': '500px'}}>
      {images.map((img, index) => (
        <Image
          key={index}
          url={img}
          width={220}
        />
      ))}
    </div>
  );
}
