
// export function VideoDemo() {
//     return (
//       <section id="videodemo" className="py-8 px-4 md:py-14">
//         {/* Heading Section */}
//         <div className="text-center py-6 transition-colors duration-300">
//           <div className="flex flex-col items-center gap-4">
//             <h2 className="text-lg md:text-5xl text-indigo-400
//              mx-auto">
//               Check out how Scribble works in this video 👇
//             </h2>
//           </div>
//         </div>
// {/*   

//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="relative w-full max-w-4xl mx-auto">
//             <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
//             <iframe 
//             className="absolute inset-0 w-full h-full border-0"
//             src="https://www.youtube.com/embed/jPW7Ywo2LcM?si=NwM7NiF-g2lT6irI" 
//             title="YouTube video player" 
//             frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
//             referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
//             </div>
//           </div>
//         </div> */}
//         {/* Video Section */}
//       <div className="mx-auto  px-2 sm:px-4 lg:px-2">
//         <div className="relative w-full  mx-auto">
//           <div className="relative  aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
//             <iframe
//               className="absolute inset-0 w-full h-full border-0"
//               src="https://www.youtube.com/embed/pfr4ZkI1XGQ?si=jHth7f8Z2A2Tj3-i"
//               title="YouTube video player"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//               referrerPolicy="strict-origin-when-cross-origin"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       </div>
//       </section>
//     );
//   }

export function VideoDemo() {
  return (
    <section
      id="videodemo"
      className="py-8 px-4 md:py-14 text-center max-w-7xl"
    >
      {/* Heading Section */}
      <div className="flex flex-col items-center justify-center gap-4 mb-8">
        <h2
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-indigo-400
           leading-snug transition-colors duration-300"
        >
          Check out how Scribble works in this video 👇
        </h2>
      </div>

      {/* Video Section */}
      <div className="flex justify-center">
        <div
          className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[80%] aspect-video 
          rounded-2xl overflow-hidden shadow-2xl"
        >
          <iframe
            className="absolute inset-0 w-full h-full border-0"
            src="https://www.youtube.com/embed/pfr4ZkI1XGQ?si=jHth7f8Z2A2Tj3-i"
            title="Scribble Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
