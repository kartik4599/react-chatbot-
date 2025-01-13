const ModelMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-t-3xl rounded-br-3xl p-3 bg-gradient-to-r from-[#02AABD] to-[#00CDAC] to-50% text-white">
        {content}
      </div>
    </div>
  );
};

export default ModelMessage;
