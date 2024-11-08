const Loading = () => {
    return (
        <div className="fixed inset-0 z-10 flex justify-center items-center h-screen bg-white/70">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
    );
}
 
export default Loading;