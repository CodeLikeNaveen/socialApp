const Background = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Cyan - top left */}
      <div
        className="
          pointer-events-none absolute
          -left-32 -top-32
          h-[600px] w-[600px]
          rounded-full
          bg-cyan-300/70
          blur-[100px]
        "
      />

      {/* Orange / Pink - center left */}
      <div
        className="
          pointer-events-none absolute
          left-[15%] top-[15%]
          h-[650px] w-[650px]
          rounded-full
          bg-orange-300/70
          blur-[120px]
        "
      />

      {/* Pink */}
      <div
        className="
          pointer-events-none absolute
          left-[30%] top-[20%]
          h-[500px] w-[500px]
          rounded-full
          bg-pink-300/60
          blur-[120px]
        "
      />

      {/* Purple - upper middle/right */}
      <div
        className="
          pointer-events-none absolute
          left-[45%] -top-20
          h-[600px] w-[600px]
          rounded-full
          bg-purple-400/60
          blur-[120px]
        "
      />

      {/* Blue - top right */}
      <div
        className="
          pointer-events-none absolute
          -right-32 -top-20
          h-[650px] w-[650px]
          rounded-full
          bg-blue-300/70
          blur-[120px]
        "
      />

      {/* Very soft white fade toward bottom */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-b
          from-transparent
          via-white/20
          to-white
        "
      />

      {/* Your actual content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Background;