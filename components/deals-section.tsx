"use client";
import { GraduationCap, Trophy, Users } from 'lucide-react';

const DealsSection = () => {
  const deals = [
    {
      id: 1,
      title: "Learn New Skills",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu tortor vel leo sollicitudin placerat.",
      icon: GraduationCap
    },
    {
      id: 2,
      title: "Earn Rewards", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu tortor vel leo sollicitudin placerat.",
      icon: Trophy
    },
    {
      id: 3,
      title: "Get A Community",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu tortor vel leo sollicitudin placerat.",
      icon: Users
    }
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 bg-black text-white">
      <div className="container mx-auto">
        <span className="text-red-500 font-semibold text-sm mb-2 block">Benefits</span> 
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Great Deals For You</h2>
        <p className="text-gray-300 text-sm sm:text-base mb-8 sm:mb-10 max-w-xl">When you join this platform you will get benefits and perks</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {deals.map((deal) => (
            <div key={deal.id} className="relative flex justify-center items-center">
              <div className="w-full aspect-square bg-[#1E1E1E] rounded-[20px] sm:rounded-[30px]" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 sm:gap-6 p-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-neutral-900 rounded-[20px] sm:rounded-[30px] flex items-center justify-center">
                  <deal.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white hover:text-red-600 transition-colors duration-300" /> 
                </div>
                <div className="flex flex-col justify-start items-center gap-2">
                  <div className="text-white text-lg sm:text-xl font-bold leading-7">{deal.title}</div>
                  <div className="text-center text-gray-500 text-sm sm:text-base font-normal tracking-tight px-2 sm:px-4">{deal.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;