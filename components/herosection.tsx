"use client";
import { Button } from "@heroui/react"; 
import Image from "next/image";
import { useRouter}   from "next/navigation";

const HeroSection = () => {
    const router = useRouter();

  return (
    <section className="text-white py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Take your Web3 and Finance Education to the Next Level
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">
            Africa Tech is a revolutionary platform that aims to upskill youth in Africa with in-demand tech and finance skills. Our courses are designed to help you land your dream job or start your own business.
          </p>
          <div className="flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-4 w-full">
            {/* Use customVariant prop */}
            <Button onPress={() => router.push("/courses")} className="sm:flex-1">
              Explore Courses
            </Button>
          </div>
        </div>
        
        {/* Image container with animated gradient circles and floating effect */}
        <div className="flex justify-center items-center mt-6 md:mt-0">
          <div className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[420px] flex justify-center items-center">
           
            {/* Medium circle 1 */}
            <div className="absolute w-[150px] h-[150px] top-[-30px] right-[40px] blur-xl opacity-80 z-0 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-red-600 animate-pulse" />
            </div>
            
            {/* Medium circle 2 */}
            <div className="absolute w-[170px] h-[170px] bottom-[30px] left-[20px] blur-xl opacity-80 z-0 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-red-500 animate-pulse" />
            </div>
            
            {/* Small circle 1 */}
            <div className="absolute w-[100px] h-[100px] top-[120px] right-[10px] blur-xl opacity-80 z-0 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-pink-400 animate-pulse" />
            </div>
            
            {/* Small circle 2 */}
            <div className="absolute w-[80px] h-[80px] bottom-[10px] right-[60px] blur-xl opacity-80 z-0 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 animate-pulse" />
            </div>
            
            {/* Main image with floating animation */}
            <div className="relative z-10 animate-float">
              <Image 
                src="/User on laptop.png" 
                alt="Hero image"
                width={500}
                height={300}
                style={{ width: 'auto', height: 'auto' }}
                priority
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
