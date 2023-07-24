function DocumentLoading() {
    return (  <div className="bg-[var(--dark-theme)] p-5 mb-5 rounded-[20px] flex flex-col animate-pulse relative">
        <div className="flex max-w-[95%] mb-5 ">
            <div className="bg-[var(--bg-dark-theme)] h-7 rounded-xl w-72">

            </div>
        </div>
        <div className="flex ">
            <div className="bg-[var(--bg-dark-theme)] h-5 rounded-xl w-32 mr-4">

            </div>
            <div className="bg-[var(--bg-dark-theme)] h-5 rounded-xl w-32">

            </div>
        </div>
        <div className="absolute right-8 top-[30%] rounded-full w-12 h-12 bg-[var(--bg-dark-theme)] "> 
            
        </div>
    </div>  );
}

export default DocumentLoading;