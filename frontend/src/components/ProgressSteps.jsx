const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-wrap mt-20 justify-center items-center space-x-4 md:space-x-20 md:flex-nowrap">
      {/* Login Step */}
      <div className={`text-center ${step1 ? "text-green-500" : "text-gray-300"} flex items-center`}>
        <span>Login</span>
        <div className="mt-2 text-lg">✅</div>
      </div>

      {/* Separator between Login and Shipping */}
      {step1 && step2 && (
        <div className="h-0.5 md:h-auto  bg-green-500 hidden md:block"></div>
      )}

      {/* Shipping Step */}
      <div className={`text-center  ${step2 ? "text-green-500" : "text-gray-300"} flex items-center`}>
        <span>Shipping</span>
        <div className="mt-2 text-lg">✅</div>
      </div>

      {/* Separator between Shipping and Summary */}
      {step2 && step3 && (
        <div className="h-0.5 md:h-auto w-[10rem] bg-green-500 hidden md:block"></div>
      )}

      {/* Summary Step */}
      <div className={`text-center ${step3 ? "text-green-500" : "text-gray-300"} flex items-center`}>
        <span>Summary</span>
        <div className="mt-2 text-lg">✅</div>
      </div>
    </div>
  );
};

export default ProgressSteps;
