type Props = {
  title: string;
  onClick?: () => void; // More specific typing for onClick
  icon?: string;
};

export default function BorderButton({ onClick, title }: Props) {
  return (
    <button
      className="flex justify-center w-[100px] text-xl rounded-sm border-2 border-blue-500 text-blue-500 font-semibold py-1 px-2 hover:bg-blue-500 hover:text-white  transition duration-200 ease-in-out"
      onClick={onClick}
    >
     
      {title}
    </button>
  );
}

