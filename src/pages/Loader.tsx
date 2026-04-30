import { useLottie } from 'lottie-react';
import runningAnimation from '../assets/logos/run.json';

function Loader() {

  const { View } = useLottie({
    animationData: runningAnimation,
    loop: true,
    autoplay: true,
    style: {
      minWidth: '100px',
      minHeight: '100px',
      maxHeight: '200px',
      maxWidth: '200px',
    }
  })

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center pb-20">
        {View}
      </div>  
    </>
  );
}

export default Loader;
