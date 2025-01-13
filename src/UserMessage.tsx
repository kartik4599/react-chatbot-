const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-t-3xl rounded-bl-3xl p-3 bg-gradient-to-r from-[#00CDAC] from-50% to-[#02AABD] text-white">
        {content}
      </div>
    </div>
  );
};

export default UserMessage;
