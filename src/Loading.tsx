const Loading = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-t-3xl rounded-br-3xl px-4 pb-4 bg-gradient-to-r from-[#00CDAC] to-[#02AABD] text-white">
        <img
          src={"https://media.tenor.com/Z80xa5tlmn4AAAAi/ellipse-dots.gif"}
          alt="loading"
          className="h-6"
        />
      </div>
    </div>
  );
};

export default Loading;
