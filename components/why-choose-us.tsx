"use client";
import Image from "next/image";

const WhyChooseUsSection = () => {
  const features = [
    {
      id: 1,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Flexible Learning",
      description: "Study at your own pace, anywhere and anytime",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Job Placement Assistance",
      description: "Get connected with top employers after completing your courses",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      )
    }
  ];

  return (
		<section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 bg-black text-white">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
					{/* IMAGE & GLOWING CIRCLES LEFT */}
					<div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[350px] md:min-h-[420px]">
						{/* Random glowing circles */}
						{/* Fixed position circles with different sizes */}
						{/* Big circle */}
						<div className="absolute w-[200px] h-[200px] top-[50px] left-[10px] blur-xl opacity-90 z-0 pointer-events-none">
							<div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-yellow-500 animate-pulse" />
						</div>

						{/* Medium circle 1 */}
						<div className="absolute w-[120px] h-[120px] top-[20px] right-[60px] blur-xl opacity-90 z-0 pointer-events-none">
							<div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-red-600 animate-pulse" />
						</div>

						{/* Medium circle 2 */}
						<div className="absolute w-[130px] h-[130px] bottom-[40px] left-[40px] blur-xl opacity-90 z-0 pointer-events-none">
							<div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-red-500 animate-pulse" />
						</div>

						{/* Small circle 1 */}
						<div className="absolute w-[80px] h-[80px] top-[150px] right-[30px] blur-xl opacity-90 z-0 pointer-events-none">
							<div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-pink-400 animate-pulse" />
						</div>

						{/* Small circle 2 */}
						<div className="absolute w-[70px] h-[70px] bottom-[20px] right-[80px] blur-xl opacity-90 z-0 pointer-events-none">
							<div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 animate-pulse" />
						</div>
						{/* Main image always on top */}
						<div className="relative z-10">
							<Image
								src="/sally.png"
								alt="Student learning"
								width={340}
								height={340}
								className="object-contain drop-shadow-2xl w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px]"
								priority
							/>
						</div>
					</div>

					{/* FEATURES RIGHT */}
					<div>
						<h2 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
							Why Choose Us: The Preferred Learning Platform
						</h2>
						<p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">
							We provide a comprehensive learning experience with the best
							instructors, flexible learning options, and career support to help
							you succeed in today&apos;s competitive job market.
						</p>
						<div className="space-y-4 sm:space-y-6">
							{features.map((feature) => (
								<div key={feature.id} className="flex">
									<div className="flex-shrink-0 mt-1">{feature.icon}</div>
									<div className="ml-3 sm:ml-4">
										<h3 className="text-lg sm:text-xl font-semibold mb-1">
											{feature.title}
										</h3>
										<p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyChooseUsSection;