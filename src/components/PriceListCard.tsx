import React from 'react';
import { FaBuilding, FaHome, FaTools, FaUmbrellaBeach } from 'react-icons/fa';

const PriceListCard: React.FC = () => {
  const services = [
    {
      name: "Architect Services",
      price: "500,000",
      unit: "/m²",
      icon: FaBuilding,
      color: "bg-blue-100 text-blue-600",
      hoverColor: "group-hover:bg-blue-200",
    },
    {
      name: "House Construction",
      price: "5,000,000",
      unit: "/m²",
      icon: FaHome,
      color: "bg-green-100 text-green-600",
      hoverColor: "group-hover:bg-green-200",
    },
    {
      name: "Home Renovation",
      price: "2,000,000",
      unit: "/m²",
      icon: FaTools,
      color: "bg-amber-100 text-amber-600",
      hoverColor: "group-hover:bg-amber-200",
    },
    {
      name: "Villa Construction",
      price: "7,500,000",
      unit: "/m²",
      icon: FaUmbrellaBeach,
      color: "bg-purple-100 text-purple-600",
      hoverColor: "group-hover:bg-purple-200",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-green-600 px-6 py-5">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center">
          Service Price List
        </h2>
        <p className="text-indigo-100 text-center mt-2 text-sm md:text-base">
          From design to construction
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="group flex items-center p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-gray-300 cursor-pointer"
          >
            <div className={`${service.color} ${service.hoverColor} p-4 rounded-lg transition-all duration-300`}>
              <service.icon className="text-2xl md:text-3xl" />
            </div>
            
            <div className="ml-4 flex-grow">
              <h3 className="font-semibold text-gray-800 text-lg md:text-xl">
                {service.name}
              </h3>
              <div className="flex items-baseline mt-1">
                <span className="text-[12px] md:text-base text-gray-500">
                  Starting from
                </span>
                <span className="ml-1 text-[12px] md:text-xl font-bold text-gray-900">
                  Rp {service.price}
                </span>
                <span className="ml-1 text-gray-600 text-sm md:text-base">
                  {service.unit}
                </span>
              </div>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-gray-600 text-xs md:text-sm mb-4">
          *Prices may vary depending on project complexity and location
        </p>
        <a href='https://wa.me/+622129222999' className="mt-8 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm md:text-base ">
          Free Consultation
        </a>
      </div>
    </div>
  );
};

export default PriceListCard;
